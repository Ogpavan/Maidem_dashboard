import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

const RegisterMaid = () => {
  const [skills, setSkills] = useState([]);
  const [educationDetails, setEducationDetails] = useState([]);
  const [foodCategories, setFoodCategories] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [genderTypes, setGenderTypes] = useState([]);
  const [maritalStatuses, setMaritalStatuses] = useState([]);
  const [preferredLanguages, setPreferredLanguages] = useState([]);
  const [proficiency, setProficiency] = useState([]);
  const [workCategories, setWorkCategories] = useState([]);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [preferredWorkLocations, setPreferredWorkLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    skill: "",
    educationField: "",
    foodCategory: "",
    foodType: "",
    maritalStatus: "",
    genderType: "",
    preferredLanguages: "",
    proficiency: "",
    workCategory: "",
    availabilitySlots: [],
    city: "",
    locality: "",
    sector: "",
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
        workCategories,
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
        fetchData("work_category", ["category"]),
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
      setWorkCategories(workCategories.map((item) => item.category));
      setAvailabilitySlots(availabilitySlots);
      setPreferredWorkLocations(workLocationData);
    };

    fetchAllData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setFormData({ ...formData, city: selectedCity, locality: "", sector: "" });
  };

  const handleLocalityChange = (e) => {
    const selectedLocality = e.target.value;
    setFormData({ ...formData, locality: selectedLocality, sector: "" });
  };

  const handleSectorChange = (e) => {
    setFormData({ ...formData, sector: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      dob,
      skill,
      educationField,
      foodCategory,
      foodType,
      genderType,
      maritalStatus,
      preferredLanguages,
      proficiency,
      workCategory,
      availabilitySlots,
      city,
      locality,
      sector,
    } = formData;

    if (!name || !skill || !educationField || !foodCategory) {
      alert("Please fill all fields!");
      return;
    }

    try {
      // Reference to your Firestore collection
      const maidsCollectionRef = collection(db, "maids");

      // Adding the maid's data to Firestore
      await addDoc(maidsCollectionRef, {
        name,
        skill,
        educationField,
        foodCategory,
        foodType,
        genderType,
        maritalStatus,
        preferredLanguages,
        proficiency,
        workCategory,
        availabilitySlots,
        city,
        locality,
        sector,
        dob,
        createdAt: new Date(), // You can add timestamp if needed
      });

      alert("Maid registered successfully!");
      setFormData({
        name: "",
        dob: "",
        skill: "",
        educationField: "",
        foodCategory: "",
        foodType: "",
        genderType: "",
        maritalStatus: "",
        preferredLanguages: "",
        proficiency: "",
        workCategory: "",
        availabilitySlots: [],
        city: "",
        locality: "",
        sector: "",
      });
      console.log("maid data", formData);
    } catch (error) {
      console.error("Error registering maid: ", error);
    }
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

        {/* Skills Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Skill
          </label>
          <select
            name="skill"
            value={formData.skill}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
          >
            <option value="" disabled>
              Select Skill
            </option>
            {skills.map((skill) => (
              <option key={skill.id} value={skill.skill}>
                {skill.skill}
              </option>
            ))}
          </select>
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
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Food Category
          </label>
          <select
            name="foodCategory"
            value={formData.foodCategory}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
          >
            <option value="" disabled>
              Select Food Category
            </option>
            {foodCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Food Types Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Food Type
          </label>
          <select
            name="foodType"
            value={formData.foodType}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
          >
            <option value="" disabled>
              Select Food Type
            </option>
            {foodTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
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
            Preferred Language
          </label>
          <select
            name="preferredLanguage"
            value={formData.preferredLanguage}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
          >
            <option value="" disabled>
              Select Preferred Language
            </option>
            {preferredLanguages.map((language, index) => (
              <option key={index} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        {/* Profiecincy*/}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Proficiency
          </label>
          <select
            name="proficiency"
            value={formData.proficiency}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
          >
            <option value="" disabled>
              Select Proficiency
            </option>
            {proficiency.map((proficiency, index) => (
              <option key={index} value={proficiency}>
                {proficiency}
              </option>
            ))}
          </select>
        </div>

        {/* Work Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Work Category
          </label>
          <select
            name="workCategory"
            value={formData.workCategory}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
          >
            <option value="" disabled>
              Select Work Category
            </option>
            {workCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Availability Slots */}
        {/* Availability Slots */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Availability Slots
          </label>
          <select
            name="availabilitySlots"
            value={formData.availabilitySlots}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
          >
            <option value="" disabled>
              Select Availability Slot
            </option>
            {availabilitySlots.map((slot, index) => (
              <option key={index} value={slot.slotName}>
                {slot.slotName} - {slot.timeRange}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            City
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={handleCityChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
          >
            <option value="" disabled>
              Select City
            </option>
            {preferredWorkLocations.map((location) => (
              <option key={location.id} value={location.city}>
                {location.city}
              </option>
            ))}
          </select>
        </div>

        {/* Locality Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Locality
          </label>
          <select
            name="locality"
            value={formData.locality}
            onChange={handleLocalityChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
            disabled={!formData.city}
          >
            <option value="" disabled>
              Select Locality
            </option>
            {preferredWorkLocations
              .find((location) => location.city === formData.city)
              ?.localities?.map((locality, index) => (
                <option key={index} value={locality.name}>
                  {locality.name}
                </option>
              ))}
          </select>
        </div>

        {/* Sector Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sector
          </label>
          <select
            name="sector"
            value={formData.sector}
            onChange={handleSectorChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
            disabled={!formData.locality}
          >
            <option value="" disabled>
              Select Sector
            </option>
            {preferredWorkLocations
              .find((location) => location.city === formData.city)
              ?.localities.find(
                (locality) => locality.name === formData.locality
              )
              ?.sectors.map((sector, index) => (
                <option key={index} value={sector}>
                  {sector}
                </option>
              ))}
          </select>
        </div>

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
