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

const Languages = () => {
  const [languages, setLanguages] = useState([]);
  const [languageName, setLanguageName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLanguages();
  }, []);

  // Fetch all languages
  const fetchLanguages = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(
        collection(db, "preferred_languages")
      );
      const languagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLanguages(languagesData);
    } catch (error) {
      console.error("Error fetching languages: ", error);
      alert("Failed to load languages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add or update a language
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!languageName.trim()) {
      alert("Please provide a valid language name.");
      return;
    }

    try {
      setLoading(true);

      // Check for duplicate entries
      const existingLanguage = languages.find(
        (lang) => lang.name.toLowerCase() === languageName.trim().toLowerCase()
      );

      if (existingLanguage && !isEditing) {
        alert("This language already exists.");
      } else if (isEditing) {
        // Update language
        const languageDoc = doc(db, "preferred_languages", editingId);
        await updateDoc(languageDoc, { name: languageName });
        alert("Language updated successfully!");
      } else {
        // Add a new language
        await addDoc(collection(db, "preferred_languages"), {
          name: languageName,
        });
        alert("Language added successfully!");
      }

      // Reset form and refresh list
      resetForm();
      fetchLanguages();
    } catch (error) {
      console.error("Error saving language: ", error);
      alert("Failed to save language. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a language
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this language?")) {
      try {
        setLoading(true);
        const languageDoc = doc(db, "preferred_languages", id);
        await deleteDoc(languageDoc);
        alert("Language deleted successfully!");
        fetchLanguages();
      } catch (error) {
        console.error("Error deleting language: ", error);
        alert("Failed to delete language. Try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Load selected language for editing
  const handleEdit = (language) => {
    setLanguageName(language.name);
    setIsEditing(true);
    setEditingId(language.id);
  };

  // Reset form state
  const resetForm = () => {
    setLanguageName("");
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Languages</h1>

      {/* Form for adding/updating languages */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Language Name
          </label>
          <input
            type="text"
            value={languageName}
            onChange={(e) => setLanguageName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="e.g., English"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`px-8 py-2 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-black/[0.8] hover:shadow-lg"
          } text-sm rounded-md font-semibold`}
        >
          {loading
            ? "Saving..."
            : isEditing
            ? "Update Language"
            : "Add Language"}
        </button>
      </form>

      {/* Languages list */}
      <div className="bg-white rounded shadow-lg">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader />
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 border">Language</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {languages.length > 0 ? (
                languages.map((language) => (
                  <tr key={language.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{language.name}</td>
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        onClick={() => handleEdit(language)}
                        className="px-8 py-2 bg-yellow-500 text-white text-sm rounded-md font-semibold hover:bg-yellow-500/[0.8] hover:shadow-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(language.id)}
                        className="px-8 py-2 bg-red-500 text-white text-sm rounded-md font-semibold hover:bg-red-500/[0.8] hover:shadow-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="2"
                    className="px-4 py-2 text-center text-gray-500"
                  >
                    No languages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Languages;
