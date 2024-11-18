import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import Loader from "./Loader";

const WorkCategory = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Default categories
  const defaultCategories = ["12 Hours", "24 Hours", "Job Work"];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "work_category"));
      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCategories(categoriesData);

      // Prevent adding duplicate default categories
      const existingCategories = categoriesData.map((cat) => cat.category);
      const missingDefaults = defaultCategories.filter(
        (defaultCat) => !existingCategories.includes(defaultCat)
      );

      if (missingDefaults.length > 0) {
        const batchPromises = missingDefaults.map((defaultCat) =>
          addDoc(collection(db, "work_category"), { category: defaultCat })
        );
        await Promise.all(batchPromises);

        // Fetch categories again after adding missing defaults
        const updatedQuerySnapshot = await getDocs(
          collection(db, "work_category")
        );
        const updatedCategories = updatedQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(updatedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to load categories. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      alert("Please enter a category.");
      return;
    }

    try {
      if (isEditing) {
        const categoryDoc = doc(db, "work_category", editingId);
        await updateDoc(categoryDoc, { category });
        alert("Category updated successfully!");
      } else {
        await addDoc(collection(db, "work_category"), { category });
        alert("Category added successfully!");
      }

      resetForm();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category. Try again.");
    }
  };

  const handleDelete = async (id) => {
    const categoryToDelete = categories.find((cat) => cat.id === id);
    if (defaultCategories.includes(categoryToDelete.category)) {
      alert("This category cannot be deleted.");
      return;
    }

    try {
      const categoryDoc = doc(db, "work_category", id);
      await deleteDoc(categoryDoc);
      alert("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Try again.");
    }
  };

  const handleEdit = (category) => {
    setCategory(category.category);
    setIsEditing(true);
    setEditingId(category.id);
  };

  const resetForm = () => {
    setCategory("");
    setIsEditing(false);
    setEditingId(null);
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
            placeholder="e.g., 12 Hours, 24 Hours, Job Work"
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
          {isLoading ? (
            <tr>
              <td
                colSpan="2"
                className="px-4 py-4 text-center text-gray-600 italic"
              >
                <Loader />
              </td>
            </tr>
          ) : categories.length > 0 ? (
            categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-4 py-2 border">{cat.category}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="px-8 py-2 bg-yellow-500 text-white text-sm rounded-md font-semibold hover:bg-yellow-500/[0.8] hover:shadow-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className={`px-8 py-2 text-sm rounded-md font-semibold hover:shadow-lg ${
                      defaultCategories.includes(cat.category)
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-500/[0.8]"
                    }`}
                    disabled={defaultCategories.includes(cat.category)}
                  >
                    {defaultCategories.includes(cat.category)
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
                No categories available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WorkCategory;
