import React, { useState } from "react";

const LoginOverlay = ({ onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = () => {
    const storedUsername = import.meta.env.VITE_USERNAME;
    const storedPassword = import.meta.env.VITE_PASSWORD;

    // Check the entered credentials
    if (username === storedUsername && password === storedPassword) {
      onLoginSuccess(true); // Call onLoginSuccess if credentials are correct
    } else {
      setErrorMessage("Invalid username or password!");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Login</h2>

        {errorMessage && (
          <p className="text-red-600 text-sm mb-4">{errorMessage}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
            placeholder="Username"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
            placeholder="Password"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Login
        </button>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LoginOverlay;
