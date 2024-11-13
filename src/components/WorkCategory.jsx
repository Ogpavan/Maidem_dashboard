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

const WorkCategory = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch work categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "work_category"));
      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
    };
    fetchCategories();
  }, []);

  // Handle form submission for adding or updating a category
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (category) {
      try {
        if (isEditing) {
          // Update the existing category
          const categoryDoc = doc(db, "work_category", editingId);
          await updateDoc(categoryDoc, { category });
          alert("Category updated successfully!");
        } else {
          // Add a new category
          await addDoc(collection(db, "work_category"), { category });
          alert("Category added successfully!");
        }

        // Reset form and refresh list
        setCategory("");
        setIsEditing(false);
        setEditingId(null);
        fetchCategories();
      } catch (error) {
        console.error("Error saving category: ", error);
        alert("Failed to save category. Try again.");
      }
    } else {
      alert("Please enter a category.");
    }
  };

  // Handle category deletion
  const handleDelete = async (id) => {
    try {
      const categoryDoc = doc(db, "work_category", id);
      await deleteDoc(categoryDoc);
      alert("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category: ", error);
      alert("Failed to delete category. Try again.");
    }
  };

  // Load selected category data for editing
  const handleEdit = (category) => {
    setCategory(category.category);
    setIsEditing(true);
    setEditingId(category.id);
  };

  // Fetch categories again to update the list
  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, "work_category"));
    const categoriesData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCategories(categoriesData);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Work Categories</h1>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="e.g., 12 hours, 24 hours, Job Work"
          />
        </div>
        <button
          type="submit"
          className="px-8 py-2 bg-black text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg"
        >
          {isEditing ? "Update Category" : "Add Category"}
        </button>
      </form>

      {/* List of Work Categories */}
      <table className="w-full text-left bg-white rounded shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Category</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="px-4 py-2 border">{category.category}</td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="px-8 py-2 bg-yellow-500 text-white text-sm rounded-md font-semibold hover:bg-yellow-500/[0.8] hover:shadow-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="px-8 py-2 bg-red-500 text-white text-sm rounded-md font-semibold hover:bg-red-500/[0.8] hover:shadow-lg"
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

export default WorkCategory;
