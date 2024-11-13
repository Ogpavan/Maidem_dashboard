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

const FoodType = () => {
  const [foodTypes, setFoodTypes] = useState([]);
  const [typeName, setTypeName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch food types from Firestore
  useEffect(() => {
    fetchFoodTypes();
  }, []);

  // Fetch food types function
  const fetchFoodTypes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "food_types"));
      const typeData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFoodTypes(typeData);
    } catch (error) {
      console.error("Error fetching food types: ", error);
      alert("Failed to load food types. Please try again.");
    }
  };

  // Handle form submission for adding or updating a food type
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (typeName.trim()) {
      try {
        if (isEditing) {
          // Update existing food type
          const foodTypeDoc = doc(db, "food_types", editingId);
          await updateDoc(foodTypeDoc, { name: typeName });
          alert("Food type updated successfully!");
        } else {
          // Add new food type
          await addDoc(collection(db, "food_types"), {
            name: typeName,
          });
          alert("Food type added successfully!");
        }

        // Reset form and refresh list
        setTypeName("");
        setIsEditing(false);
        setEditingId(null);
        fetchFoodTypes();
      } catch (error) {
        console.error("Error saving food type: ", error);
        alert("Failed to save food type. Please try again.");
      }
    } else {
      alert("Please enter a food type name.");
    }
  };

  // Handle food type deletion
  const handleDelete = async (id) => {
    try {
      const foodTypeDoc = doc(db, "food_types", id);
      await deleteDoc(foodTypeDoc);
      alert("Food type deleted successfully!");
      fetchFoodTypes();
    } catch (error) {
      console.error("Error deleting food type: ", error);
      alert("Failed to delete food type. Please try again.");
    }
  };

  // Load selected food type for editing
  const handleEdit = (foodType) => {
    setTypeName(foodType.name);
    setIsEditing(true);
    setEditingId(foodType.id);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Food Types</h1>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type Name
          </label>
          <input
            type="text"
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="e.g., Veg, Non-Veg, Both"
          />
        </div>
        <button
          type="submit"
          className="px-8 py-2 bg-black text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg"
        >
          {isEditing ? "Update Type" : "Add Type"}
        </button>
      </form>

      {/* List of Food Types */}
      <table className="w-full text-left bg-white rounded shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Food Type</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {foodTypes.map((type, index) => (
            <tr key={type.id}>
              <td className="px-4 py-2 border">{type.name}</td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  onClick={() => handleEdit(type)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(type.id)}
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

export default FoodType;
