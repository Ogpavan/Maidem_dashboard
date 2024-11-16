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

const Languages = () => {
  const [languages, setLanguages] = useState([]);
  const [languageName, setLanguageName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch languages from Firestore
  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    const querySnapshot = await getDocs(collection(db, "preferred_languages"));
    const languagesData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setLanguages(languagesData);
  };

  // Handle form submission for adding or updating a language
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (languageName) {
      try {
        if (isEditing) {
          // Update the existing language
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
        setLanguageName("");
        setIsEditing(false);
        setEditingId(null);
        fetchLanguages();
      } catch (error) {
        console.error("Error saving language: ", error);
        alert("Failed to save language. Try again.");
      }
    } else {
      alert("Please provide a language name.");
    }
  };

  // Handle language deletion
  const handleDelete = async (id) => {
    try {
      const languageDoc = doc(db, "preferred_languages", id);
      await deleteDoc(languageDoc);
      alert("Language deleted successfully!");
      fetchLanguages();
    } catch (error) {
      console.error("Error deleting language: ", error);
      alert("Failed to delete language. Try again.");
    }
  };

  // Load selected language data for editing
  const handleEdit = (language) => {
    setLanguageName(language.name);
    setIsEditing(true);
    setEditingId(language.id);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Languages</h1>

      {/* Add / Edit Form */}
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
          className="px-8 py-2 bg-black text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg"
        >
          {isEditing ? "Update Language" : "Add Language"}
        </button>
      </form>

      {/* List of Languages */}
      <table className="w-full text-left bg-white rounded shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Language</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {languages.map((language) => (
            <tr key={language.id}>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Languages;
