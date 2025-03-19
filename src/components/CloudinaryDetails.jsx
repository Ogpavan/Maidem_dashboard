import { useState, useEffect } from "react";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import Loader from "./Loader";

const CloudinaryDetails = () => {
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadPreset, setUploadPreset] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "cloudinary_details"),
      (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setUploadUrl(data.uploadUrl || "");
          setUploadPreset(data.uploadPreset || "");
        }
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = doc(db, "cloudinary_details", "settings");
      await setDoc(docRef, { uploadUrl, uploadPreset });
      alert("Cloudinary details updated successfully!");
    } catch (error) {
      console.error("Error updating Cloudinary details: ", error);
      alert("Failed to update. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Cloudinary Settings
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload URL
          </label>
          <input
            type="text"
            value={uploadUrl}
            onChange={(e) => setUploadUrl(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="https://api.cloudinary.com/..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Preset
          </label>
          <input
            type="text"
            value={uploadPreset}
            onChange={(e) => setUploadPreset(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="example_preset"
          />
        </div>
        <button
          type="submit"
          className="px-8 py-2 bg-black text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
};

export default CloudinaryDetails;
