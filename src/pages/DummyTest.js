import React from "react";
import { FaImage, FaPaperPlane } from "react-icons/fa";

const DummyTest = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-200 to-purple-300">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 transition-all duration-500 hover:shadow-2xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add Update</h2>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex flex-col justify-center items-center bg-gray-50 hover:bg-gray-100 transition duration-300">
          <FaImage className="text-gray-400 text-4xl mb-2 animate-pulse" />
          <p className="text-gray-600 text-sm">Drag photos or videos here</p>
          <p className="text-gray-500 text-sm">or</p>
          <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Select photos or videos
          </button>
        </div>

        <textarea
          placeholder="Add a description"
          className="w-full mt-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          maxLength={1500}
          rows={4}
        ></textarea>

        <div className="mt-4">
          <label className="block text-gray-600 text-sm font-medium mb-1">Add a button (optional)</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="none">None</option>
            <option value="learn-more">Learn More</option>
            <option value="sign-up">Sign Up</option>
            <option value="visit-site">Visit Site</option>
          </select>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition">
            Preview
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center transition">
            <FaPaperPlane className="mr-2" /> Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default DummyTest;
