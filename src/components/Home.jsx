import React, { useEffect, useState } from "react";
import { db } from "../config/firebase"; // Assuming you have a firebase config file
import { collection, getDocs } from "firebase/firestore";

const Home = () => {
  const [entries, setEntries] = useState({
    foodCategory: 0,
    foodType: 0,
    genderType: 0,
    maritalStatus: 0,
    preferredSkills: 0,
    workCategory: 0,
    preferredLanguages: 0,
    proficiency: 0,
    preferredWorkLocations: 0,
  });

  const [loading, setLoading] = useState(true); // Loading state for each box

  // Predefined list of collection names with corresponding user-friendly labels
  const collectionNames = [
    { collection: "availability_slots", label: "Availability Slots" },

    { collection: "education_details", label: "Education Details" },
    { collection: "food_categories", label: "Food Categories" },
    { collection: "food_types", label: "Food Types" },
    { collection: "gender_types", label: "Gender Types" },
    { collection: "marital_statuses", label: "Marital Statuses" },
    { collection: "preferred_languages", label: "Preferred Languages" },
    { collection: "preferred_skills", label: "Preferred Skills" },
    {
      collection: "preferred_work_location",
      label: "Preferred Work Locations",
    },
    { collection: "proficiency_options", label: "Proficiency Options" },
    { collection: "work_category", label: "Work Category" },
  ];

  // Fetch the total number of entries from the respective collections
  useEffect(() => {
    const fetchEntryCounts = async () => {
      try {
        const counts = {};

        // Loop through each collection and get the document count
        for (const { collection: collectionName, label } of collectionNames) {
          const querySnapshot = await getDocs(collection(db, collectionName));
          counts[label] = querySnapshot.size; // Get the number of documents in each collection
        }

        setEntries(counts); // Update state with the counts
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching entry counts: ", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchEntryCounts();
  }, []);

  return (
    <div className="relative p-4 max-w-7xl mx-auto">
      {/* Welcome Message */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome Admin!</h1>
        <p className="text-lg text-gray-600">
          Here is a quick overview of the system entries.
        </p>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(entries).map(([label, count]) => (
          <div
            key={label}
            className="relative bg-white rounded-lg shadow-md p-6 text-center border border-gray-200"
          >
            {/* Loader for each individual box */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
                <div className="animate-spin border-t-4 border-blue-600 border-solid w-16 h-16 rounded-full"></div>
              </div>
            )}

            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {label}
            </h2>
            <p className="text-2xl font-bold text-blue-600 mt-4">{count}</p>
            <p className="text-sm text-gray-500">Entries</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
