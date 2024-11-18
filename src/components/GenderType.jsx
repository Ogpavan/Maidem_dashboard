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

const GenderType = () => {
  const [genderTypes, setGenderTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tableLoading, setTableLoading] = useState(false);

  // Fetch gender types from Firestore
  useEffect(() => {
    fetchGenderTypes();
  }, []);

  const fetchGenderTypes = async () => {
    setTableLoading(true);
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
    } finally {
      setTableLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Please enter a gender type name.");
      return;
    }

    try {
      if (isEditing) {
        const genderTypeDoc = doc(db, "gender_types", editingId);
        await updateDoc(genderTypeDoc, formData);
        alert("Gender type updated successfully!");
      } else {
        const existingTypes = await getDocs(
          query(
            collection(db, "gender_types"),
            where("name", "==", formData.name.trim())
          )
        );
        if (!existingTypes.empty) {
          alert("This gender type already exists.");
          return;
        }
        await addDoc(collection(db, "gender_types"), formData);
        alert("Gender type added successfully!");
      }
      setFormData({ name: "" });
      setIsEditing(false);
      setEditingId(null);
      fetchGenderTypes();
    } catch (error) {
      console.error("Error saving gender type: ", error);
      alert("Failed to save gender type. Please try again.");
    }
  };

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

  const handleEdit = (genderType) => {
    setFormData({ name: genderType.name });
    setIsEditing(true);
    setEditingId(genderType.id);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Gender Types</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
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
        <button
          type="submit"
          className="px-8 py-2 bg-black text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg"
        >
          {isEditing ? "Update Gender" : "Add Gender"}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left bg-white rounded shadow-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Gender Type</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableLoading ? (
              <tr>
                <td colSpan={2} className="px-4 py-2 border text-center">
                  <Loader />
                </td>
              </tr>
            ) : genderTypes.length > 0 ? (
              genderTypes.map((genderType) => (
                <tr key={genderType.id}>
                  <td className="px-4 py-2 border">{genderType.name}</td>
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
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-4 py-2 border text-center">
                  No gender types found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenderType;
