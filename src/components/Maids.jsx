import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase"; // Adjust based on export type

const Maids = () => {
  const [maids, setMaids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaid, setSelectedMaid] = useState(null);

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
      } catch (error) {
        console.error("Error fetching maids:", error);
        setLoading(false);
      }
    };

    fetchMaids();
  }, []);

  if (loading) {
    return <div>Loading maids...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Available Maids</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {maids.map((maid) => (
          <div
            key={maid.id}
            className="bg-white border rounded-lg shadow-md p-4 text-center hover:shadow-lg"
          >
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg"
              alt={maid.Name}
              className="w-32 h-32 mx-auto rounded-full mb-4 object-cover"
            />
            <h2 className="text-lg font-semibold">{maid.Name}</h2>
            <p className="text-gray-600">
              Age: {new Date().getFullYear() - new Date(maid.DOB).getFullYear()}
            </p>
            <button
              className="mt-4 px-6 text-blue-500 underline"
              onClick={() => setSelectedMaid(maid)}
            >
              Read More
            </button>
          </div>
        ))}
      </div>

      {/* Modal for showing maid details */}
      {selectedMaid && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 flex overflow-hidden">
            {/* Left Side: Content */}
            <div className="w-full md:w-2/3 p-6">
              <h2 className="text-2xl font-bold mb-4">{selectedMaid.Name}</h2>
              <p className="mb-2">
                <strong>Gender:</strong> {selectedMaid.Gender}
              </p>
              <p className="mb-2">
                <strong>Age:</strong>{" "}
                {new Date().getFullYear() -
                  new Date(selectedMaid.DOB).getFullYear()}
              </p>
              <p className="mb-2">
                <strong>Education:</strong> {selectedMaid["Education Details"]}
              </p>
              <p className="mb-2">
                <strong>Marital Status:</strong>{" "}
                {selectedMaid["Marital Status"]}
              </p>
              <p className="mb-2">
                <strong>Maid Story:</strong> {selectedMaid["Maid Story"]}
              </p>
              <p className="mb-2">
                <strong>Mobile Number:</strong> {selectedMaid.mobileNumber}
              </p>
              <p className="mb-2">
                <strong>Preferred Languages:</strong>
              </p>
              <ul className="list-disc list-inside pl-4">
                {selectedMaid["Preferred Languages"] &&
                  Object.entries(selectedMaid["Preferred Languages"]).map(
                    ([lang, level]) => (
                      <li key={lang}>
                        {lang}: {level}
                      </li>
                    )
                  )}
              </ul>
              <p className="mb-2">
                <strong>Skills:</strong> {selectedMaid.Skills.join(", ")}
              </p>
              <p className="mb-2">
                <strong>Working City:</strong> {selectedMaid["Working City"]}
              </p>
              <p className="mb-2">
                <strong>Working Locality:</strong>{" "}
                {selectedMaid["Working Locality"]}
              </p>
              <p className="mb-2">
                <strong>Availability Slots:</strong>
              </p>
              <ul className="list-disc list-inside pl-4">
                {selectedMaid["Availability Slots"].map((slot, index) => (
                  <li key={index}>{slot}</li>
                ))}
              </ul>
            </div>

            {/* Right Side: Image */}
            <div className="relative md:block md:w-1/2 p-4 flex items-center justify-center">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setSelectedMaid(null)}
              >
                ✖
              </button>
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg"
                alt={selectedMaid.Name}
                className=" object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maids;
