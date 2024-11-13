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

const GenderType = () => {
  const [genderTypes, setGenderTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch gender types from Firestore
  useEffect(() => {
    fetchGenderTypes();
  }, []);

  // Fetch gender types function
  const fetchGenderTypes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "gender_types"));
      const typeData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGenderTypes(typeData);
    } catch (error) {
      console.error("Error fetching gender types: ", error);
      alert("Failed to load gender types. Please try again.");
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission for adding or updating a gender type
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.name) {
      try {
        if (isEditing) {
          // Update existing gender type
          const genderTypeDoc = doc(db, "gender_types", editingId);
          await updateDoc(genderTypeDoc, formData);
          alert("Gender type updated successfully!");
        } else {
          // Add new gender type
          await addDoc(collection(db, "gender_types"), formData);
          alert("Gender type added successfully!");
        }

        // Reset form and refresh list
        setFormData({
          name: "",
        });
        setIsEditing(false);
        setEditingId(null);
        fetchGenderTypes();
      } catch (error) {
        console.error("Error saving gender type: ", error);
        alert("Failed to save gender type. Please try again.");
      }
    } else {
      alert("Please enter a gender type name.");
    }
  };

  // Handle gender type deletion
  const handleDelete = async (id) => {
    try {
      const genderTypeDoc = doc(db, "gender_types", id);
      await deleteDoc(genderTypeDoc);
      alert("Gender type deleted successfully!");
      fetchGenderTypes();
    } catch (error) {
      console.error("Error deleting gender type: ", error);
      alert("Failed to delete gender type. Please try again.");
    }
  };

  // Load selected gender type for editing
  const handleEdit = (genderType) => {
    setFormData({
      name: genderType.name,
    });
    setIsEditing(true);
    setEditingId(genderType.id);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Gender Types</h1>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender Type Name*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="e.g., Male, Female, Non-Binary"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-2 bg-black text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg"
        >
          {isEditing ? "Update Gender" : "Add Gender"}
        </button>
      </form>

      {/* List of Gender Types */}
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-white rounded shadow-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Gender Type</th>

              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {genderTypes.map((genderType) => (
              <tr key={genderType.id}>
                <td className="px-4 py-2 border">
                  <span className="font-medium">{genderType.name}</span>
                </td>

                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(genderType)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(genderType.id)}
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
    </div>
  );
};

export default GenderType;
