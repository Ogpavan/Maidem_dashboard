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

const PreferredWorkLocation = () => {
  const [locations, setLocations] = useState([]);
  const [city, setCity] = useState("");
  const [localities, setLocalities] = useState([{ name: "", sectors: [""] }]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Define fetchLocations outside useEffect
  const fetchLocations = async () => {
    const querySnapshot = await getDocs(
      collection(db, "preferred_work_location")
    );
    const locationsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setLocations(locationsData);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (city && localities.length) {
      // Check for duplicate localities
      const localityNames = localities.map((locality) =>
        locality.name.trim().toLowerCase()
      );
      const hasDuplicateLocalities =
        new Set(localityNames).size !== localityNames.length;

      if (hasDuplicateLocalities) {
        alert(
          "Duplicate localities found. Please ensure all locality names are unique."
        );
        return;
      }

      // Check for duplicate sectors within each locality
      for (const locality of localities) {
        const sectorNames = locality.sectors.map((sector) =>
          sector.trim().toLowerCase()
        );
        const hasDuplicateSectors =
          new Set(sectorNames).size !== sectorNames.length;

        if (hasDuplicateSectors) {
          alert(
            `Duplicate sectors found in locality "${locality.name}". Please ensure all sector names are unique.`
          );
          return;
        }
      }

      try {
        const data = {
          city,
          localities: localities.map((locality) => ({
            name: locality.name,
            sectors: Array.from(new Set(locality.sectors)),
          })),
        };

        if (isEditing) {
          const locationDoc = doc(db, "preferred_work_location", editingId);
          await updateDoc(locationDoc, data);
          alert("Location updated successfully!");
        } else {
          await addDoc(collection(db, "preferred_work_location"), data);
          alert("Location added successfully!");
        }

        setCity("");
        setLocalities([{ name: "", sectors: [""] }]);
        setIsEditing(false);
        setEditingId(null);
        fetchLocations(); // Fetch locations after submit
      } catch (error) {
        console.error("Error saving location: ", error);
        alert("Failed to save location. Try again.");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const locationDoc = doc(db, "preferred_work_location", id);
      await deleteDoc(locationDoc);
      alert("Location deleted successfully!");
      fetchLocations(); // Fetch locations after deletion
    } catch (error) {
      console.error("Error deleting location: ", error);
      alert("Failed to delete location. Try again.");
    }
  };

  const handleEdit = (location) => {
    setCity(location.city);
    setLocalities(
      location.localities.map((locality) => ({
        name: locality.name,
        sectors: Array.from(new Set(locality.sectors)),
      }))
    );
    setIsEditing(true);
    setEditingId(location.id);
  };

  const addLocality = () =>
    setLocalities([...localities, { name: "", sectors: [""] }]);

  const addSector = (localityIndex) => {
    const newLocalities = [...localities];
    newLocalities[localityIndex].sectors.push("");
    setLocalities(newLocalities);
  };

  const handleLocalityChange = (index, value) => {
    const newLocalities = [...localities];
    newLocalities[index].name = value;
    setLocalities(newLocalities);
  };

  const handleSectorChange = (localityIndex, sectorIndex, value) => {
    const newLocalities = [...localities];
    newLocalities[localityIndex].sectors[sectorIndex] = value;
    setLocalities(newLocalities);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Preferred Work Locations
      </h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter city name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Localities and Sectors
          </label>
          {localities.map((locality, localityIndex) => (
            <div key={localityIndex} className="mt-4">
              <input
                type="text"
                value={locality.name}
                onChange={(e) =>
                  handleLocalityChange(localityIndex, e.target.value)
                }
                className="block w-full px-3 py-2 mb-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter locality name"
              />
              {locality.sectors.map((sector, sectorIndex) => (
                <div key={sectorIndex} className="flex items-center mt-1">
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) =>
                      handleSectorChange(
                        localityIndex,
                        sectorIndex,
                        e.target.value
                      )
                    }
                    className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Enter sector"
                  />
                  {sectorIndex === locality.sectors.length - 1 && (
                    <button
                      type="button"
                      onClick={() => addSector(localityIndex)}
                      className="ml-2 px-4 py-2 bg-black text-white rounded-md text-nowrap"
                    >
                      Add Sector
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}
          <button
            type="button"
            onClick={addLocality}
            className="mt-2 px-3 py-2 bg-white text-black rounded-md"
          >
            Add Locality
          </button>
        </div>

        <button
          type="submit"
          className="px-8 py-2 bg-black text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg"
        >
          {isEditing ? "Update Location" : "Add Location"}
        </button>
      </form>

      <table className="w-full text-left bg-white rounded shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 border">City</th>
            <th className="px-4 py-2 border">Localities</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location.id}>
              <td className="px-4 py-2 border">{location.city}</td>
              <td className="px-4 py-2 border">
                {location.localities.map((loc, idx) => (
                  <div key={idx}>
                    <strong>{loc.name}</strong>: {loc.sectors.join(", ")}
                  </div>
                ))}
              </td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  onClick={() => handleEdit(location)}
                  className="px-8 py-2 bg-yellow-500 text-white text-sm rounded-md font-semibold hover:bg-yellow-500/[0.8] hover:shadow-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(location.id)}
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

export default PreferredWorkLocation;
