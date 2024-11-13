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

const PreferredSkill = () => {
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch preferred skills from Firestore
  useEffect(() => {
    const fetchSkills = async () => {
      const querySnapshot = await getDocs(collection(db, "preferred_skills"));
      const skillsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSkills(skillsData);
    };
    fetchSkills();
  }, []);

  // Handle form submission for adding or updating a skill
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (skill) {
      try {
        if (isEditing) {
          // Update the existing skill
          const skillDoc = doc(db, "preferred_skills", editingId);
          await updateDoc(skillDoc, { skill });
          alert("Skill updated successfully!");
        } else {
          // Add a new skill
          await addDoc(collection(db, "preferred_skills"), { skill });
          alert("Skill added successfully!");
        }

        // Reset form and refresh list
        setSkill("");
        setIsEditing(false);
        setEditingId(null);
        fetchSkills();
      } catch (error) {
        console.error("Error saving skill: ", error);
        alert("Failed to save skill. Try again.");
      }
    } else {
      alert("Please enter a skill.");
    }
  };

  // Handle skill deletion
  const handleDelete = async (id) => {
    try {
      const skillDoc = doc(db, "preferred_skills", id);
      await deleteDoc(skillDoc);
      alert("Skill deleted successfully!");
      fetchSkills();
    } catch (error) {
      console.error("Error deleting skill: ", error);
      alert("Failed to delete skill. Try again.");
    }
  };

  // Load selected skill data for editing
  const handleEdit = (skill) => {
    setSkill(skill.skill);
    setIsEditing(true);
    setEditingId(skill.id);
  };

  // Fetch skills again to update the list
  const fetchSkills = async () => {
    const querySnapshot = await getDocs(collection(db, "preferred_skills"));
    const skillsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSkills(skillsData);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Preferred Skills
      </h1>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Skill
          </label>
          <input
            type="text"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="e.g., Cleaning"
          />
        </div>
        <button
          type="submit"
          className="px-8 py-2 bg-black text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg"
        >
          {isEditing ? "Update Skill" : "Add Skill"}
        </button>
      </form>

      {/* List of Preferred Skills */}
      <table className="w-full text-left bg-white rounded-md shadow-lg ">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-r">Skill</th>
            <th className="px-4 py-2 border-r">Actions</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill) => (
            <tr key={skill.id}>
              <td className="px-4 py-2 border">{skill.skill}</td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  onClick={() => handleEdit(skill)}
                  className="px-8 py-2 bg-yellow-500 text-white text-sm rounded-md font-semibold hover:bg-yellow-500/[0.8] hover:shadow-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(skill.id)}
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

export default PreferredSkill;
