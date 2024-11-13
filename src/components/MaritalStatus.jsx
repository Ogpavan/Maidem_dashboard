import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebase";

const MaritalStatus = () => {
  const [statuses, setStatuses] = useState([]);
  const [statusName, setStatusName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch marital statuses from Firestore
  useEffect(() => {
    const fetchStatuses = async () => {
      const querySnapshot = await getDocs(collection(db, "marital_statuses"));
      const statusData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStatuses(statusData);
    };
    fetchStatuses();
  }, []);

  // Handle form submission for adding or updating a status
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (statusName.trim()) {
      try {
        if (isEditing) {
          // Update existing status
          const statusDoc = doc(db, "marital_statuses", editingId);
          await updateDoc(statusDoc, { statusName });
          alert("Status updated successfully!");
        } else {
          // Add new status
          await addDoc(collection(db, "marital_statuses"), {
            statusName,
            createdAt: new Date().toISOString(),
          });
          alert("Status added successfully!");
        }

        // Reset form and refresh list
        setStatusName("");
        setIsEditing(false);
        setEditingId(null);
        fetchStatuses();
      } catch (error) {
        console.error("Error saving status: ", error);
        alert("Failed to save status. Please try again.");
      }
    } else {
      alert("Please enter a status name.");
    }
  };

  // Handle status deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this status?")) {
      try {
        const statusDoc = doc(db, "marital_statuses", id);
        await deleteDoc(statusDoc);
        alert("Status deleted successfully!");
        fetchStatuses();
      } catch (error) {
        console.error("Error deleting status: ", error);
        alert("Failed to delete status. Please try again.");
      }
    }
  };

  // Load selected status for editing
  const handleEdit = (status) => {
    setStatusName(status.statusName);
    setIsEditing(true);
    setEditingId(status.id);
  };

  // Fetch statuses again to update the list
  const fetchStatuses = async () => {
    const querySnapshot = await getDocs(collection(db, "marital_statuses"));
    const statusData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStatuses(statusData);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Marital Status Management
      </h1>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status Name
          </label>
          <input
            type="text"
            value={statusName}
            onChange={(e) => setStatusName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="e.g., Married"
          />
        </div>
        <button
          type="submit"
          className="px-8 py-2 bg-black text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg"
        >
          {isEditing ? "Update Status" : "Add Status"}
        </button>
      </form>

      {/* Status List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 border-b text-gray-900">Status Name</th>
              <th className="px-4 py-3 border-b text-gray-900">Type</th>
              <th className="px-4 py-3 border-b text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {statuses.map((status) => (
              <tr key={status.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{status.statusName}</td>
                <td className="px-4 py-3 text-gray-600">(string)</td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    onClick={() => handleEdit(status)}
                    className="px-4 py-1 bg-yellow-500 text-white text-sm rounded-md font-semibold hover:bg-yellow-500/[0.8] hover:shadow-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(status.id)}
                    className="px-4 py-1 bg-red-500 text-white text-sm rounded-md font-semibold hover:bg-red-500/[0.8] hover:shadow-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaritalStatus;
