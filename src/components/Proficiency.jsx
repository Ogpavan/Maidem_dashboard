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

const Proficiency = () => {
  const [proficiencyList, setProficiencyList] = useState([]);
  const [proficiencyName, setProficiencyName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loader state for table data
  const [loadingRowId, setLoadingRowId] = useState(null); // Loader for specific rows

  // Fetch proficiencies from Firestore
  useEffect(() => {
    fetchProficiencies();
  }, []);

  const fetchProficiencies = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(
        collection(db, "proficiency_options")
      );
      const proficiencyData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProficiencyList(proficiencyData);
    } catch (error) {
      console.error("Error fetching proficiencies: ", error);
      alert("Failed to load data. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProficiency = async () => {
    const proficiencyDocRef = isEditing
      ? doc(db, "proficiency_options", editingId)
      : collection(db, "proficiency_options");

    try {
      if (isEditing) {
        await updateDoc(proficiencyDocRef, { name: proficiencyName });
        alert("Proficiency updated successfully!");
      } else {
        await addDoc(proficiencyDocRef, { name: proficiencyName });
        alert("Proficiency added successfully!");
      }
      resetForm();
      fetchProficiencies();
    } catch (error) {
      console.error("Error saving proficiency: ", error);
      alert("Failed to save proficiency. Try again.");
    }
  };

  const handleDelete = async (id) => {
    setLoadingRowId(id); // Show loader for the specific row
    try {
      const proficiencyDoc = doc(db, "proficiency_options", id);
      await deleteDoc(proficiencyDoc);
      alert("Proficiency deleted successfully!");
      fetchProficiencies();
    } catch (error) {
      console.error("Error deleting proficiency: ", error);
      alert("Failed to delete proficiency. Try again.");
    } finally {
      setLoadingRowId(null); // Reset loader for the specific row
    }
  };

  const handleEdit = (proficiency) => {
    setProficiencyName(proficiency.name);
    setIsEditing(true);
    setEditingId(proficiency.id);
  };

  const resetForm = () => {
    setProficiencyName("");
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!proficiencyName) {
      alert("Please provide a proficiency name.");
      return;
    }
    handleSaveProficiency();
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Proficiencies</h1>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Proficiency Name
          </label>
          <input
            type="text"
            value={proficiencyName}
            onChange={(e) => setProficiencyName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="e.g., Speak"
          />
        </div>
        <button
          type="submit"
          className="px-8 py-2 bg-black text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg"
        >
          {isEditing ? "Update Proficiency" : "Add Proficiency"}
        </button>
      </form>

      {/* List of Proficiencies */}
      <table className="w-full text-left bg-white rounded shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Proficiency</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="2" className="text-center py-4">
                <Loader />
              </td>
            </tr>
          ) : proficiencyList.length > 0 ? (
            proficiencyList.map((proficiency) => (
              <tr key={proficiency.id}>
                <td className="px-4 py-2 border">
                  {loadingRowId === proficiency.id ? (
                    <Loader />
                  ) : (
                    proficiency.name
                  )}
                </td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(proficiency)}
                    className="px-8 py-2 bg-yellow-500 text-white text-sm rounded-md font-semibold hover:bg-yellow-500/[0.8] hover:shadow-lg"
                    disabled={loadingRowId === proficiency.id}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(proficiency.id)}
                    className="px-8 py-2 bg-red-500 text-white text-sm rounded-md font-semibold hover:bg-red-500/[0.8] hover:shadow-lg"
                    disabled={loadingRowId === proficiency.id}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="py-6 text-center text-gray-600">
                No proficiencies available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Proficiency;
