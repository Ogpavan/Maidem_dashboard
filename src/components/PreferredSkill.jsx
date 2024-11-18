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
import Loader from "../components/Loader"; // Import the Loader component

const PreferredSkill = () => {
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true); // Loader state

  const defaultSkills = ["Cleaning", "Cooking"];

  useEffect(() => {
    const initializeSkills = async () => {
      setLoading(true); // Start loading
      try {
        const querySnapshot = await getDocs(collection(db, "preferred_skills"));
        const fetchedSkills = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const fetchedSkillNames = fetchedSkills.map((skill) => skill.skill);
        const missingSkills = defaultSkills.filter(
          (defaultSkill) => !fetchedSkillNames.includes(defaultSkill)
        );

        for (const skill of missingSkills) {
          await addDoc(collection(db, "preferred_skills"), { skill });
        }

        setSkills([...fetchedSkills]);
      } catch (error) {
        console.error("Error initializing skills: ", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    initializeSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (skill.trim()) {
      try {
        if (isEditing) {
          const skillDoc = doc(db, "preferred_skills", editingId);
          await updateDoc(skillDoc, { skill });
          alert("Skill updated successfully!");
        } else {
          const skillExists = skills.some(
            (existingSkill) =>
              existingSkill.skill.toLowerCase() === skill.toLowerCase()
          );
          if (skillExists) {
            alert("This skill already exists.");
            return;
          }
          await addDoc(collection(db, "preferred_skills"), { skill });
          alert("Skill added successfully!");
        }

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

  const handleDelete = async (id) => {
    const skillToDelete = skills.find((skill) => skill.id === id);
    if (defaultSkills.includes(skillToDelete.skill)) {
      alert("This skill cannot be deleted.");
      return;
    }

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

  const handleEdit = (skill) => {
    setSkill(skill.skill);
    setIsEditing(true);
    setEditingId(skill.id);
  };

  const fetchSkills = async () => {
    setLoading(true); // Start loading
    try {
      const querySnapshot = await getDocs(collection(db, "preferred_skills"));
      const skillsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSkills(skillsData);
    } catch (error) {
      console.error("Error fetching skills: ", error);
    } finally {
      setLoading(false); // End loading
    }
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
      <table className="w-full text-left bg-white rounded-md shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-r">Skill</th>
            <th className="px-4 py-2 border-r">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? ( // Show loader while fetching data
            <tr>
              <td colSpan="2" className="px-4 py-6 text-center">
                <Loader />
              </td>
            </tr>
          ) : skills.length > 0 ? (
            skills.map((skill) => (
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
                    className={`px-8 py-2 text-sm rounded-md font-semibold hover:shadow-lg ${
                      defaultSkills.includes(skill.skill)
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-500/[0.8]"
                    }`}
                    disabled={defaultSkills.includes(skill.skill)}
                  >
                    {defaultSkills.includes(skill.skill)
                      ? "Cannot Delete"
                      : "Delete"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="px-4 py-6 text-center text-gray-500">
                No skills found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PreferredSkill;
