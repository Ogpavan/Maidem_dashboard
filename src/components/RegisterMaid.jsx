import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

const RegisterMaid = () => {
  const [skills, setSkills] = useState([]);
  const [workLocations, setWorkLocations] = useState([]);
  const [educationDetails, setEducationDetails] = useState([]);
  const [foodCategories, setFoodCategories] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [genderTypes, setGenderTypes] = useState([]);
  const [maritalStatuses, setMaritalStatuses] = useState([]);
  const [preferredLanguages, setPreferredLanguages] = useState([]);
  const [proficiency, setProficiency] = useState([]);
  const [preferredWorkType, setPreferredWorkType] = useState([]);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [locations, setLocations] = useState([]); // Fetched locations
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocalities, setSelectedLocalities] = useState([]); // Multiple selected localities
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    skill: "",
    educationField: "",
    foodCategory: [],
    foodType: [],
    maritalStatus: "",
    genderType: "",
    preferredLanguages: [],
    proficiency: "",
    preferredWorkType: [],
    availabilitySlots: [],
    city: "",
    locality: [],
    sector: [],
    dob: "",
  });

  // Reusable function to fetch data from Firestore
  const fetchData = async (collectionName, extractFields = null) => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      if (extractFields) {
        return querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return extractFields.reduce((obj, field) => {
            obj[field] = data[field] || null;
            return obj;
          }, {});
        });
      }
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error(`Error fetching data from ${collectionName}: `, error);
      return [];
    }
  };

  // Fetch all required data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      const [
        skillsData,
        educationData,
        foodData,
        foodTypes,
        genderTypes,
        maritalStatuses,
        preferredLanguages,
        proficiency,

        preferredWorkType,
        availabilitySlots,
        workLocationData,
      ] = await Promise.all([
        fetchData("preferred_skills"),
        fetchData("education_details", ["educationField"]),
        fetchData("food_categories", ["name"]),
        fetchData("food_types", ["name"]),
        fetchData("gender_types", ["name"]),
        fetchData("marital_statuses", ["statusName"]),
        fetchData("preferred_languages", ["name"]),
        fetchData("proficiency_options", ["name"]),
        fetchData("preferred_work_type"),
        fetchData("availability_slots", ["slotName", "timeRange"]),
        fetchData("preferred_work_location"),
      ]);

      setSkills(skillsData);
      setEducationDetails(educationData.map((item) => item.educationField));
      setFoodCategories(foodData.map((item) => item.name));
      setFoodTypes(foodTypes.map((item) => item.name));
      setGenderTypes(genderTypes.map((item) => item.name));
      setMaritalStatuses(maritalStatuses.map((item) => item.statusName));
      setPreferredLanguages(preferredLanguages.map((item) => item.name));
      setProficiency(proficiency.map((item) => item.name));
      setPreferredWorkType(preferredWorkType.map((item) => item.workType));
      setAvailabilitySlots(availabilitySlots);
      setPreferredWorkLocations(workLocationData);
    };

    fetchAllData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
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

  // Handle City Change

  // Filtered Data

  const handlePreferredLanguageChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedLanguages = checked
        ? [...prev.preferredLanguages, { language: value, proficiency: "" }]
        : prev.preferredLanguages.filter((lang) => lang.language !== value);
      return { ...prev, preferredLanguages: updatedLanguages };
    });
  };

  const handleLanguageChange = (e, language) => {
    const { value } = e.target;
    setFormData((prev) => {
      const updatedLanguages = prev.preferredLanguages.map((lang) =>
        lang.language === language ? { ...lang, proficiency: value } : lang
      );
      return { ...prev, preferredLanguages: updatedLanguages };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      mobileNumber,
      dob,
      skill,
      educationField,
      foodCategory,
      foodType,
      genderType,
      maritalStatus,
      preferredLanguages,
      proficiency,
      preferredWorkType,
      availabilitySlots,
    } = formData;

    // Work location data including city, localities, and sectors
    const workLocationData = {
      city: {
        name: selectedCity,
        localities: selectedLocalities.map((locality) => ({
          name: locality,
          sectors: selectedSectors
            .filter((sector) => sector.locality === locality)
            .map((sector) => sector.name),
        })),
      },
    };

    // Form validation
    if (!name || !skill || !educationField || !foodCategory || !selectedCity) {
      alert("Please fill all fields!");
      return;
    }

    const maidData = {
      name,
      mobileNumber,
      dob,
      skill,
      educationField,
      foodCategory,
      foodType,
      genderType,
      maritalStatus,
      preferredLanguages,
      proficiency,
      preferredWorkType,
      availabilitySlots,
      ...workLocationData, // Add work location data (city, localities, sectors)
    };

    try {
      // Reference to the maids collection
      const maidsCollectionRef = collection(db, "maids");

      // Save the maid's data, including city and locality details
      await addDoc(maidsCollectionRef, {
        ...maidData,
        createdAt: new Date(), // Add timestamp
      });

      alert("Maid registered successfully!");

      // Reset form data after successful save
      setFormData({
        name: "",
        mobileNumber: "",
        dob: "",
        skill: "",
        educationField: "",
        foodCategory: [],
        foodType: [],
        genderType: "",
        maritalStatus: "",
        preferredLanguages: "",
        proficiency: "",
        workCategory: [],
        availabilitySlots: [],
        preferredWorkType: [],
        city: "",
        locality: "",
        sector: "",
      });
      setSelectedCity(""); // Reset selected city
      setSelectedLocalities([]); // Reset selected localities
      setSelectedSectors([]); // Reset selected sectors

      console.log("Maid data saved successfully:", maidData);
    } catch (error) {
      console.error("Error saving maid data: ", error);
      alert("An error occurred while saving the maid data.");
    }
  };

  // Locality selection toggle function
  const toggleLocalitySelection = (locality) => {
    setSelectedLocalities((prevLocalities) =>
      prevLocalities.includes(locality)
        ? prevLocalities.filter((loc) => loc !== locality)
        : [...prevLocalities, locality]
    );
  };

  // Sector selection toggle function
  const toggleSectorSelection = (sector, locality) => {
    setSelectedSectors((prevSectors) => {
      const sectorKey = `${locality}-${sector}`;
      if (
        prevSectors.some((s) => s.name === sector && s.locality === locality)
      ) {
        return prevSectors.filter(
          (s) => !(s.name === sector && s.locality === locality)
        );
      } else {
        return [...prevSectors, { name: sector, locality: locality }];
      }
    });
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-10 text-gray-800 ">Register Maid</h1>
      <form onSubmit={handleSubmit} className="space-y-4 px-20">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Maid Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
            placeholder="Enter maid's name"
          />
        </div>
        {/* Date of Birth Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mobile Number
          </label>
          <input
            type="tel"
            name="mobileNumber" // Correct the name to match the formData field
            value={formData.mobileNumber}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
            placeholder="Enter maid's Mobile Number"
            pattern="^[0-9]{10}$" // Optional pattern for 10 digits
            required // Optional: Make it a required field
          />
        </div>
        {/* Skills Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills
          </label>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <button
                key={skill.id}
                type="button"
                className={`px-4 py-2 border rounded-full focus:outline-none ${
                  formData.skill.includes(skill.skill)
                    ? "bg-[#e2ceaa] text-black"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => {
                  if (formData.skill.includes(skill.skill)) {
                    setFormData({
                      ...formData,
                      skill: formData.skill.filter((s) => s !== skill.skill),
                    });
                  } else {
                    setFormData({
                      ...formData,
                      skill: [...formData.skill, skill.skill],
                    });
                  }
                }}
              >
                {skill.skill}
              </button>
            ))}
          </div>
        </div>
        {/* Education Field Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Education Field
          </label>
          <select
            name="educationField"
            value={formData.educationField}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
          >
            <option value="" disabled>
              Select Education Field
            </option>
            {educationDetails.map((education, index) => (
              <option key={index} value={education}>
                {education}
              </option>
            ))}
          </select>
        </div>
        {/* Food Categories Dropdown */}
        {/* Food Categories Checkboxes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Food Categories
          </label>

          <div className="mt-1 space-y-2">
            {foodCategories.map((category, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  name="foodCategory"
                  value={category}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        foodCategory: [
                          ...formData.foodCategory,
                          e.target.value,
                        ],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        foodCategory: formData.foodCategory.filter(
                          (item) => item !== e.target.value
                        ),
                      });
                    }
                  }}
                  checked={formData.foodCategory.includes(category)}
                  className="mr-2"
                />
                <label>{category}</label>
              </div>
            ))}
          </div>
        </div>
        {/* Food Types Dropdown */}
        {/* Food Types Checkboxes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Food Types
          </label>
          <div className="mt-1 space-y-2">
            {foodTypes.map((type, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  name="foodTypes"
                  value={type}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        foodType: [...formData.foodType, e.target.value],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        foodType: formData.foodType.filter(
                          (item) => item !== e.target.value
                        ),
                      });
                    }
                  }}
                  checked={formData.foodType.includes(type)}
                  className="mr-2"
                />
                <label>{type}</label>
              </div>
            ))}
          </div>
        </div>
        {/* Gender Types Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender Type
          </label>
          <select
            name="genderType"
            value={formData.genderType}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
          >
            <option value="" disabled>
              Select Gender Type
            </option>
            {genderTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        {/* Marital Status Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Marital Status
          </label>
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
          >
            <option value="" disabled>
              Select Marital Status
            </option>
            {maritalStatuses.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        {/* preffered language */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preferred Languages
          </label>
          <div className="space-y-2">
            {preferredLanguages.map((language, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  value={language}
                  onChange={handlePreferredLanguageChange}
                  checked={
                    Array.isArray(formData.preferredLanguages) &&
                    formData.preferredLanguages.some(
                      (lang) => lang.language === language
                    )
                  }
                  className="mr-2"
                />
                <label>{language}</label>

                {Array.isArray(formData.preferredLanguages) &&
                  formData.preferredLanguages.some(
                    (lang) => lang.language === language
                  ) && (
                    <select
                      onChange={(e) => handleLanguageChange(e, language)}
                      className="ml-4 px-3 py-2 border rounded-md"
                    >
                      <option value="" disabled>
                        Select Proficiency
                      </option>
                      {proficiency.map((level, idx) => (
                        <option key={idx} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  )}
              </div>
            ))}
          </div>
        </div>

        {/* Work Category Dropdown */}
        {/* Preferred Work Types Checkboxes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preferred Work Types
          </label>
          <div className="mt-1 space-y-2">
            {preferredWorkType.map((type, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  name="preferredWorkType"
                  value={type}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        preferredWorkType: [
                          ...formData.preferredWorkType,
                          e.target.value,
                        ],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        preferredWorkType: formData.preferredWorkType.filter(
                          (item) => item !== e.target.value
                        ),
                      });
                    }
                  }}
                  checked={formData.preferredWorkType.includes(type)}
                  className="mr-2"
                />
                <label>{type}</label>
              </div>
            ))}
          </div>
        </div>
        {/* Availability Slots */}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Availability Slots
          </label>
          <div className="mt-1 space-y-2">
            {availabilitySlots.map((slot, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  name="availabilitySlots"
                  value={slot.slotName} // Store the slot name as the value
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        availabilitySlots: [
                          ...formData.availabilitySlots,
                          slot.slotName, // Add selected slot to the array
                        ],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        availabilitySlots: formData.availabilitySlots.filter(
                          (item) => item !== slot.slotName // Remove unselected slot from the array
                        ),
                      });
                    }
                  }}
                  checked={formData.availabilitySlots.includes(slot.slotName)} // Check if the slot is selected
                  className="mr-2"
                />
                <label>
                  {slot.slotName} - {slot.timeRange}{" "}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            City
          </label>
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

        {/* Submit Button */}
        <button
          type="submit"
          className="px-8 py-3 bg-black text-white text-md rounded-md  font-semibold hover:bg-black/[0.8] hover:shadow-lg w-full"
        >
          Register Maid
        </button>
      </form>
    </div>
  );
};

export default RegisterMaid;
