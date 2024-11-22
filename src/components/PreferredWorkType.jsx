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
import Loader from "./Loader";

const PreferredWorkType = () => {
  const [workTypes, setWorkTypes] = useState([]);
  const [workType, setWorkType] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Default preferred work types
  const defaultWorkTypes = ["12 Hours", "24 Hours", "Job Work"];

  useEffect(() => {
    fetchWorkTypes();
  }, []);

  const fetchWorkTypes = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(
        collection(db, "preferred_work_type")
      );
      const workTypesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setWorkTypes(workTypesData);

      // Prevent adding duplicate default work types
      const existingWorkTypes = workTypesData.map((type) => type.workType);
      const missingDefaults = defaultWorkTypes.filter(
        (defaultType) => !existingWorkTypes.includes(defaultType)
      );

      if (missingDefaults.length > 0) {
        const batchPromises = missingDefaults.map((defaultType) =>
          addDoc(collection(db, "preferred_work_type"), {
            workType: defaultType,
          })
        );
        await Promise.all(batchPromises);

        // Fetch work types again after adding missing defaults
        const updatedQuerySnapshot = await getDocs(
          collection(db, "preferred_work_type")
        );
        const updatedWorkTypes = updatedQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWorkTypes(updatedWorkTypes);
      }
    } catch (error) {
      console.error("Error fetching work types:", error);
      alert("Failed to load work types. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workType) {
      alert("Please enter a work type.");
      return;
    }

    try {
      if (isEditing) {
        const workTypeDoc = doc(db, "preferred_work_type", editingId);
        await updateDoc(workTypeDoc, { workType });
        alert("Work type updated successfully!");
      } else {
        await addDoc(collection(db, "preferred_work_type"), { workType });
        alert("Work type added successfully!");
      }

      resetForm();
      fetchWorkTypes();
    } catch (error) {
      console.error("Error saving work type:", error);
      alert("Failed to save work type. Try again.");
    }
  };

  const handleDelete = async (id) => {
    const typeToDelete = workTypes.find((type) => type.id === id);
    if (defaultWorkTypes.includes(typeToDelete.workType)) {
      alert("This work type cannot be deleted.");
      return;
    }

    try {
      const workTypeDoc = doc(db, "preferred_work_type", id);
      await deleteDoc(workTypeDoc);
      alert("Work type deleted successfully!");
      fetchWorkTypes();
    } catch (error) {
      console.error("Error deleting work type:", error);
      alert("Failed to delete work type. Try again.");
    }
  };

  const handleEdit = (type) => {
    setWorkType(type.workType);
    setIsEditing(true);
    setEditingId(type.id);
  };

  const resetForm = () => {
    setWorkType("");
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Preferred Work Types
      </h1>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Work Type
          </label>
          <input
            type="text"
            value={workType}
            onChange={(e) => setWorkType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="e.g., 12 Hours, 24 Hours, Job Work"
          />
        </div>
        <button
          type="submit"
          className="px-8 py-2 bg-black text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg"
        >
          {isEditing ? "Update Work Type" : "Add Work Type"}
        </button>
      </form>

      {/* List of Preferred Work Types */}
      <table className="w-full text-left bg-white rounded shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Work Type</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan="2"
                className="px-4 py-4 text-center text-gray-600 italic"
              >
                <Loader />
              </td>
            </tr>
          ) : workTypes.length > 0 ? (
            workTypes.map((type) => (
              <tr key={type.id}>
                <td className="px-4 py-2 border">{type.workType}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(type)}
                    className="px-8 py-2 bg-yellow-500 text-white text-sm rounded-md font-semibold hover:bg-yellow-500/[0.8] hover:shadow-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(type.id)}
                    className={`px-8 py-2 text-sm rounded-md font-semibold hover:shadow-lg ${
                      defaultWorkTypes.includes(type.workType)
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-500/[0.8]"
                    }`}
                    disabled={defaultWorkTypes.includes(type.workType)}
                  >
                    {defaultWorkTypes.includes(type.workType)
                      ? "Cannot Delete"
                      : "Delete"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="2"
                className="px-4 py-4 text-center text-gray-600 italic"
              >
                No work types available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PreferredWorkType;
