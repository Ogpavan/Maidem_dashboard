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

const AvailabilitySlots = () => {
  const [slots, setSlots] = useState([]);
  const [slotName, setSlotName] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch availability slots from Firestore
  useEffect(() => {
    const fetchSlots = async () => {
      const querySnapshot = await getDocs(collection(db, "availability_slots"));
      const slotsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSlots(slotsData);
    };
    fetchSlots();
  }, []);

  // Handle form submission for adding or updating a slot
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (slotName && timeRange) {
      try {
        if (isEditing) {
          // Update the existing slot
          const slotDoc = doc(db, "availability_slots", editingId);
          await updateDoc(slotDoc, { slotName, timeRange });
          alert("Slot updated successfully!");
        } else {
          // Add a new slot
          await addDoc(collection(db, "availability_slots"), {
            slotName,
            timeRange,
          });
          alert("Slot added successfully!");
        }

        // Reset form and refresh list
        setSlotName("");
        setTimeRange("");
        setIsEditing(false);
        setEditingId(null);
        fetchSlots();
      } catch (error) {
        console.error("Error saving slot: ", error);
        alert("Failed to save slot. Try again.");
      }
    } else {
      alert("Please fill in both fields.");
    }
  };

  // Handle slot deletion
  const handleDelete = async (id) => {
    try {
      const slotDoc = doc(db, "availability_slots", id);
      await deleteDoc(slotDoc);
      alert("Slot deleted successfully!");
      fetchSlots();
    } catch (error) {
      console.error("Error deleting slot: ", error);
      alert("Failed to delete slot. Try again.");
    }
  };

  // Load selected slot data for editing
  const handleEdit = (slot) => {
    setSlotName(slot.slotName);
    setTimeRange(slot.timeRange);
    setIsEditing(true);
    setEditingId(slot.id);
  };

  // Fetch slots again to update the list
  const fetchSlots = async () => {
    const querySnapshot = await getDocs(collection(db, "availability_slots"));
    const slotsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSlots(slotsData);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Availability Slots
      </h1>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Slot Name
          </label>
          <input
            type="text"
            value={slotName}
            onChange={(e) => setSlotName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="e.g., Slot1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Time Range
          </label>
          <input
            type="text"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="e.g., 4:00 pm - 5:00 pm"
          />
        </div>
        <button
          type="submit"
          className="px-8 py-2  bg-black text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg"
        >
          {isEditing ? "Update Slot" : "Add Slot"}
        </button>
      </form>

      {/* List of Availability Slots */}
      <table className="w-full text-left bg-white rounded shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Slot</th>
            <th className="px-4 py-2 border">Time Range</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot) => (
            <tr key={slot.id}>
              <td className="px-4 py-2 border">{slot.slotName}</td>
              <td className="px-4 py-2 border">{slot.timeRange}</td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  onClick={() => handleEdit(slot)}
                  className="px-8 py-2  bg-yellow-500 text-white text-sm rounded-md font-semibold hover:bg-yellow-500/[0.8] hover:shadow-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(slot.id)}
                  className="px-8 py-2  bg-red-500 text-white text-sm rounded-md font-semibold hover:bg-red-500/[0.8] hover:shadow-lg"
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

export default AvailabilitySlots;
