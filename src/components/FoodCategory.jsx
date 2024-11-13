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

const FoodCategory = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch categories from Firestore
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories function
  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "food_categories"));
      const categoryData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoryData);
    } catch (error) {
      console.error("Error fetching categories: ", error);
      alert("Failed to load categories. Please try again.");
    }
  };

  // Handle form submission for adding or updating a category
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (categoryName) {
      try {
        if (isEditing) {
          // Update existing category
          const categoryDoc = doc(db, "food_categories", editingId);
          await updateDoc(categoryDoc, { name: categoryName });
          alert("Category updated successfully!");
        } else {
          // Add new category
          await addDoc(collection(db, "food_categories"), {
            name: categoryName,
          });
          alert("Category added successfully!");
        }

        // Reset form and refresh list
        setCategoryName("");
        setIsEditing(false);
        setEditingId(null);
        fetchCategories();
      } catch (error) {
        console.error("Error saving category: ", error);
        alert("Failed to save category. Please try again.");
      }
    } else {
      alert("Please enter a category name.");
    }
  };

  // Handle category deletion
  const handleDelete = async (id) => {
    try {
      const categoryDoc = doc(db, "food_categories", id);
      await deleteDoc(categoryDoc);
      alert("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category: ", error);
      alert("Failed to delete category. Please try again.");
    }
  };

  // Load selected category for editing
  const handleEdit = (category) => {
    setCategoryName(category.name);
    setIsEditing(true);
    setEditingId(category.id);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Food Categories</h1>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category Name
          </label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="e.g., North Indian"
          />
        </div>
        <button
          type="submit"
          className="px-8 py-2 bg-black text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg"
        >
          {isEditing ? "Update Category" : "Add Category"}
        </button>
      </form>

      {/* List of Categories */}
      <table className="w-full text-left bg-white rounded shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Category Name</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="px-4 py-2 border">{category.name}</td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
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

export default FoodCategory;
