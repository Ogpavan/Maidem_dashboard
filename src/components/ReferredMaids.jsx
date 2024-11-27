import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebase";
// Initialize Firebase (replace with your Firebase config)

const ReferredMaids = () => {
  const [referredMaids, setReferredMaids] = useState([]);

  // Fetch referredmaid data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const maidCollection = collection(db, "referredMaid");
      const maidSnapshot = await getDocs(maidCollection);
      const maidList = maidSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(maidList);
      setReferredMaids(maidList);
    };
    fetchData();
  }, []);

  // Delete a document from Firestore
  const deleteMaid = async (id) => {
    try {
      await deleteDoc(doc(db, "referredMaid", id));
      setReferredMaids(referredMaids.filter((maid) => maid.id !== id));
      alert("Document deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete document.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Referred Maid List</h1>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Customer Name</th>
            <th className="border border-gray-300 px-4 py-2">
              Customer Mobile
            </th>
            <th className="border border-gray-300 px-4 py-2">Maid Name</th>
            <th className="border border-gray-300 px-4 py-2">Maid Mobile</th>
            <th className="border border-gray-300 px-4 py-2">Timestamp</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {referredMaids.map(
            ({
              id,
              customerName,
              customerMobile,
              maidName,
              maidMobile,
              timestamp,
            }) => (
              <tr key={id}>
                <td className="border border-gray-300 px-4 py-2">
                  {customerName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {customerMobile}
                </td>
                <td className="border border-gray-300 px-4 py-2">{maidName}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {maidMobile}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(timestamp.seconds * 1000).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => deleteMaid(id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReferredMaids;
