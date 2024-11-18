import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase"; // Adjust based on export type
import { Link } from "react-router-dom";
// Import delete icon
import { Trash2 } from "lucide-react";

const Maids = () => {
  const [maids, setMaids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaid, setSelectedMaid] = useState(null); // To track the selected maid for details modal
  const [isDeleteConfirmVisible, setDeleteConfirmVisible] = useState(false); // Track delete confirmation visibility
  const [maidToDelete, setMaidToDelete] = useState(null); // Track the maid to delete

  useEffect(() => {
    const fetchMaids = async () => {
      try {
        const maidsCollection = collection(db, "maids");
        const maidsSnapshot = await getDocs(maidsCollection);
        const maidsList = maidsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMaids(maidsList);
        setLoading(false);
        console.log(maidsList);
      } catch (error) {
        console.error("Error fetching maids:", error);
        setLoading(false);
      }
    };

    fetchMaids();
  }, []);

  const handleDelete = async () => {
    if (maidToDelete) {
      try {
        const maidRef = doc(db, "maids", maidToDelete.id);
        await deleteDoc(maidRef);
        setMaids(maids.filter((maid) => maid.id !== maidToDelete.id)); // Remove deleted maid from state
        setDeleteConfirmVisible(false);
        setMaidToDelete(null); // Clear maid to delete
      } catch (error) {
        console.error("Error deleting maid:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading maids...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold ">Available Maids</h1>
        <Link to={"/registermaid"}>
          <button className="px-8 py-2 bg-black text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg">
            Register New Maid
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {maids.map((maid) => (
          <div
            key={maid.id}
            className="relative bg-white border rounded-lg shadow-md p-4 text-center hover:shadow-lg"
          >
            {/* Delete Icon for each maid */}
            <button
              className="absolute top-2 right-2 text-red-500"
              onClick={() => {
                setMaidToDelete(maid); // Set the maid to delete
                setDeleteConfirmVisible(true); // Show the delete confirmation popup
              }}
            >
              <Trash2 size={20} />
            </button>

            <img
              src="https://via.placeholder.com/150" // Replace with maid's image URL if available
              alt={maid.name}
              className="w-32 h-32 mx-auto rounded-full mb-4"
            />
            <h2 className="text-lg font-semibold">{maid.name}</h2>

            <button
              className="mt-4 px-4 py-2 text-blue-500 underline"
              onClick={() => setSelectedMaid(maid)}
            >
              Read More
            </button>
          </div>
        ))}
      </div>

      {/* Modal for showing maid details */}
      {/* Modal for showing maid details */}
      {selectedMaid && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6">
            <div className="text-right">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedMaid(null)}
              >
                ✖
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-4">{selectedMaid.name}</h2>

            {/* Maid details */}
            <p>
              <strong>Gender:</strong> {selectedMaid.genderType}
            </p>
            <p>
              <strong>Age:</strong>{" "}
              {selectedMaid.dob
                ? new Date().getFullYear() -
                  new Date(selectedMaid.dob).getFullYear()
                : "N/A"}
            </p>

            <p>
              <strong>Education:</strong> {selectedMaid.educationField}
            </p>
            <p>
              <strong>Marital Status:</strong> {selectedMaid.maritalStatus}
            </p>
            <p>
              <strong>Proficiency:</strong> {selectedMaid.proficiency}
            </p>
            <p>
              <strong>Food Category:</strong> {selectedMaid.foodCategory}
            </p>
            <p>
              <strong>Food Type:</strong> {selectedMaid.foodType}
            </p>
            <p>
              <strong>Skills:</strong> {selectedMaid.skill}
            </p>
            <p>
              <strong>Sector:</strong> {selectedMaid.sector}
            </p>
            <p>
              <strong>Work Category:</strong> {selectedMaid.workCategory}
            </p>
            <p>
              <strong>Working City:</strong> {selectedMaid.city}
            </p>
            <p>
              <strong>Working Locality:</strong> {selectedMaid.locality}
            </p>

            {/* Availability Slots */}
            <p>
              <strong>Availability Slots:</strong>
            </p>
            <ul>
              {selectedMaid.availabilitySlots ? (
                <li>{selectedMaid.availabilitySlots}</li>
              ) : (
                <li>No availability slots listed</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6">
            <h2 className="text-xl font-semibold mb-4">
              Are you sure you want to delete this maid?
            </h2>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
                onClick={() => setDeleteConfirmVisible(false)} // Close the confirmation modal
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maids;
