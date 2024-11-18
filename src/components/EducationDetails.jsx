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

const EducationDetails = () => {
  const [educationList, setEducationList] = useState([]);
  const [educationField, setEducationField] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tableLoading, setTableLoading] = useState(false);

  // Fetch education details from Firestore
  useEffect(() => {
    fetchEducationDetails();
  }, []);

  const fetchEducationDetails = async () => {
    setTableLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "education_details"));
      const educationData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEducationList(educationData);
    } catch (error) {
      console.error("Error fetching education details: ", error);
    } finally {
      setTableLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (educationField) {
      try {
        if (isEditing) {
          const educationDoc = doc(db, "education_details", editingId);
          await updateDoc(educationDoc, { educationField });
          alert("Education detail updated successfully!");
        } else {
          await addDoc(collection(db, "education_details"), {
            educationField,
          });
          alert("Education detail added successfully!");
        }
        setEducationField("");
        setIsEditing(false);
        setEditingId(null);
        fetchEducationDetails();
      } catch (error) {
        console.error("Error saving education detail: ", error);
        alert("Failed to save education detail. Try again.");
      }
    } else {
      alert("Please fill in the field.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const educationDoc = doc(db, "education_details", id);
      await deleteDoc(educationDoc);
      alert("Education detail deleted successfully!");
      fetchEducationDetails();
    } catch (error) {
      console.error("Error deleting education detail: ", error);
      alert("Failed to delete education detail. Try again.");
    }
  };

  const handleEdit = (field) => {
    setEducationField(field.educationField);
    setIsEditing(true);
    setEditingId(field.id);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Education Details
      </h1>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Education Field
          </label>
          <input
            type="text"
            value={educationField}
            onChange={(e) => setEducationField(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="e.g., 10th pass"
          />
        </div>
        <button
          type="submit"
          className="px-8 py-2 bg-black text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg"
        >
          {isEditing ? "Update Education" : "Add Education"}
        </button>
      </form>

      {/* List of Education Details */}
      <table className="w-full text-left bg-white rounded shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Education Field</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableLoading ? (
            <tr>
              <td
                colSpan={2}
                className="px-4 py-2 border text-center text-gray-500"
              >
                <Loader />
              </td>
            </tr>
          ) : educationList.length > 0 ? (
            educationList.map((field) => (
              <tr key={field.id}>
                <td className="px-4 py-2 border">{field.educationField}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(field)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(field.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={2}
                className="px-4 py-2 border text-center text-gray-500"
              >
                No education details found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EducationDetails;
