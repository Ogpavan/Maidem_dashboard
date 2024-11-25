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
        console.log("Fetched maids:", maidsList); // Check the structure of the fetched maids data
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
        <h1 className="text-3xl font-bold">Available Maids</h1>
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
      {selectedMaid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 md:mx-auto p-6 relative h-[80vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedMaid(null)}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold text-center mb-6">
              {selectedMaid.name}
            </h2>
            <div className="space-y-4">
              <p>
                <strong>Story:</strong> {selectedMaid.maidStory}
              </p>

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
                <strong>Mobile Number:</strong>{" "}
                {selectedMaid.mobileNumber || "N/A"}
              </p>
              <p>
                <strong>Education:</strong> {selectedMaid.educationField}
              </p>
              <p>
                <strong>Marital Status:</strong> {selectedMaid.maritalStatus}
              </p>
              <p>
                <strong>Skills:</strong>
                <ul className="list-disc list-inside">
                  {selectedMaid.skill && selectedMaid.skill.length > 0
                    ? selectedMaid.skill.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))
                    : "N/A"}
                </ul>
              </p>

              <p>
                <strong>Food Category:</strong>
                <ul className="list-disc list-inside">
                  {selectedMaid.foodCategory &&
                  selectedMaid.foodCategory.length > 0
                    ? selectedMaid.foodCategory.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))
                    : "N/A"}
                </ul>
              </p>

              <p>
                <strong>Food Type:</strong>
                <span>{selectedMaid.foodType || "N/A"}</span>
              </p>

              <p>
                <strong>Preferred Languages:</strong>
                <ul className="list-disc list-inside">
                  {selectedMaid.preferredLanguages &&
                  selectedMaid.preferredLanguages.length > 0
                    ? selectedMaid.preferredLanguages.map((lang, index) => (
                        <li key={index}>
                          {lang.language} - {lang.proficiency}
                        </li>
                      ))
                    : "N/A"}
                </ul>
              </p>
              <p>
                <strong>Preferred Work Type:</strong>
                <ul className="list-disc list-inside">
                  {selectedMaid.preferredWorkType &&
                  selectedMaid.preferredWorkType.length > 0
                    ? selectedMaid.preferredWorkType.map((work, index) => (
                        <li key={index}>{work}</li>
                      ))
                    : "N/A"}
                </ul>
              </p>
              <p>
                <strong>Availability Slots:</strong>
                <ul className="list-disc list-inside">
                  {Array.isArray(selectedMaid.availabilitySlots) &&
                  selectedMaid.availabilitySlots.length > 0
                    ? selectedMaid.availabilitySlots.map((slot, index) => (
                        <li key={index}>{slot}</li>
                      ))
                    : "No availability slots listed"}
                </ul>
              </p>
              <p>
                <strong>City:</strong> {selectedMaid.city?.name || "N/A"}
              </p>
              <p>
                <strong>Localities:</strong>
                <ul className="list-disc list-inside">
                  {selectedMaid.city?.localities &&
                  selectedMaid.city.localities.length > 0
                    ? selectedMaid.city.localities.map((locality, index) => (
                        <li key={index}>
                          {locality.name} - Sectors:{" "}
                          {locality.sectors.join(", ")}
                        </li>
                      ))
                    : "No localities listed"}
                </ul>
              </p>
            </div>
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
