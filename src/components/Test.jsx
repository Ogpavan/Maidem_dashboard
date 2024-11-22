import React, { useState, useEffect } from "react";
import { db } from "../config/firebase"; // Firebase setup
import { collection, addDoc, getDocs } from "firebase/firestore";

const Test = () => {
  const [locations, setLocations] = useState([]); // Fetched locations
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocalities, setSelectedLocalities] = useState([]); // Multiple selected localities
  const [selectedSectors, setSelectedSectors] = useState([]); // Multiple selected sectors
  const [savedData, setSavedData] = useState([]); // Saved data

  // Fetch data from Firestore
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "preferred_work_location")
        );
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  // Handle Save
  const handleSave = () => {
    if (
      selectedCity &&
      selectedLocalities.length > 0 &&
      selectedSectors.length > 0
    ) {
      const newEntry = {
        city: selectedCity,
        localities: selectedLocalities.map((locality) => ({
          name: locality,
          sectors: selectedSectors
            .filter((sector) => sector.locality === locality)
            .map((sector) => sector.name),
        })),
      };
      setSavedData([...savedData, newEntry]);

      // Reset selections
      setSelectedCity("");
      setSelectedLocalities([]);
      setSelectedSectors([]);

      // Optionally save to Firestore
      addDoc(collection(db, "saved_work_locations"), newEntry)
        .then(() => alert("Data saved successfully!"))
        .catch((error) => console.error("Error saving data:", error));
    } else {
      alert("Please select all fields!");
    }
  };

  // Handle checkbox toggle for localities
  const toggleLocalitySelection = (locality) => {
    if (selectedLocalities.includes(locality)) {
      setSelectedLocalities(
        selectedLocalities.filter((loc) => loc !== locality)
      );
      setSelectedSectors(
        selectedSectors.filter((sector) => sector.locality !== locality)
      );
    } else {
      setSelectedLocalities([...selectedLocalities, locality]);
    }
  };

  // Handle checkbox toggle for sectors
  const toggleSectorSelection = (sector, locality) => {
    const sectorKey = `${locality}_${sector}`;
    if (selectedSectors.some((s) => s.key === sectorKey)) {
      setSelectedSectors(selectedSectors.filter((s) => s.key !== sectorKey));
    } else {
      setSelectedSectors([
        ...selectedSectors,
        { name: sector, locality, key: sectorKey },
      ]);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Select Work Location</h1>

      {/* City Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">City</label>
        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setSelectedLocalities([]);
            setSelectedSectors([]);
          }}
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
        >
          <option value="">Select a city</option>
          {locations.map((location) => (
            <option key={location.id} value={location.city}>
              {location.city}
            </option>
          ))}
        </select>
      </div>

      {/* Locality Checkboxes */}
      {selectedCity && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Localities
          </label>
          {locations
            .find((location) => location.city === selectedCity)
            ?.localities.map((locality, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`locality-${index}`}
                  checked={selectedLocalities.includes(locality.name)}
                  onChange={() => toggleLocalitySelection(locality.name)}
                  className="mr-2"
                />
                <label htmlFor={`locality-${index}`}>{locality.name}</label>
              </div>
            ))}
        </div>
      )}

      {/* Sector Checkboxes */}
      {selectedLocalities.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Sectors
          </label>
          {selectedLocalities.map((locality, locIndex) => (
            <div key={locIndex} className="mb-2">
              <p className="font-medium text-gray-600">{locality}</p>
              {locations
                .find((location) => location.city === selectedCity)
                ?.localities.find((loc) => loc.name === locality)
                ?.sectors.map((sector, secIndex) => (
                  <div key={secIndex} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id={`sector-${locIndex}-${secIndex}`}
                      checked={selectedSectors.some(
                        (s) => s.name === sector && s.locality === locality
                      )}
                      onChange={() => toggleSectorSelection(sector, locality)}
                      className="mr-2"
                    />
                    <label htmlFor={`sector-${locIndex}-${secIndex}`}>
                      {sector}
                    </label>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="block w-full bg-blue-600 text-white py-2 rounded-md shadow-md"
      >
        Save Work Location
      </button>

      {/* Saved Data */}
      {savedData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Saved Work Locations</h2>
          {savedData.map((data, index) => (
            <div key={index} className="border p-4 rounded-md mb-4">
              <p>
                <strong>City:</strong> {data.city}
              </p>
              {data.localities.map((locality, locIndex) => (
                <div key={locIndex}>
                  <p>
                    <strong>Locality:</strong> {locality.name}
                  </p>
                  <p>
                    <strong>Sectors:</strong> {locality.sectors.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Test;
