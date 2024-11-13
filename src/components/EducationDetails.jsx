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

const EducationDetails = () => {
  const [educationList, setEducationList] = useState([]);
  const [educationField, setEducationField] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch education details from Firestore
  useEffect(() => {
    const fetchEducationDetails = async () => {
      const querySnapshot = await getDocs(collection(db, "education_details"));
      const educationData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEducationList(educationData);
    };
    fetchEducationDetails();
  }, []);

  // Handle form submission for adding or updating an education field
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (educationField) {
      try {
        if (isEditing) {
          // Update the existing education field
          const educationDoc = doc(db, "education_details", editingId);
          await updateDoc(educationDoc, { educationField });
          alert("Education detail updated successfully!");
        } else {
          // Add a new education field
          await addDoc(collection(db, "education_details"), {
            educationField,
          });
          alert("Education detail added successfully!");
        }

        // Reset form and refresh list
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

  // Handle education field deletion
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

  // Load selected education field data for editing
  const handleEdit = (field) => {
    setEducationField(field.educationField);
    setIsEditing(true);
    setEditingId(field.id);
  };

  // Fetch education details again to update the list
  const fetchEducationDetails = async () => {
    const querySnapshot = await getDocs(collection(db, "education_details"));
    const educationData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEducationList(educationData);
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
          {isEditing ? "Update Education" : "Add  Education "}
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
          {educationList.map((field) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EducationDetails;
