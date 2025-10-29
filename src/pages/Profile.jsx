import React from "react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src="https://i.pinimg.com/736x/f7/7d/77/f77d775902d4a00b80883cb6b6c61ce8.jpg"
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <button
                className="absolute -bottom-1 -right-1 bg-white border border-gray-200 p-1 rounded-full text-sm shadow-sm hover:shadow-md"
                title="Change photo"
              >
                ✏️
              </button>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">Suyash Soni</h2>
              <p className="text-gray-500">AI & Consciousness Researcher</p>
              <p className="text-gray-400 text-sm">Bengaluru, India</p>
            </div>
          </div>

          <div className="flex gap-3 mt-4 sm:mt-0">
            <button className="bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50">
              Message
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white shadow-sm rounded-xl p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
            <div className="flex items-center gap-2">
              <button className="text-sm text-gray-500 hover:text-gray-700">Preview</button>
              <button className="text-sm bg-white border border-gray-200 px-3 py-1 rounded-md hover:bg-gray-50">
                Edit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="font-medium text-gray-500 text-sm">First Name</p>
              <p>Suyash</p>
            </div>
            <div>
              <p className="font-medium text-gray-500 text-sm">Last Name</p>
              <p>Soni</p>
            </div>
            <div>
              <p className="font-medium text-gray-500 text-sm">Email address</p>
              <p>suyash@example.com</p>
            </div>
            <div>
              <p className="font-medium text-gray-500 text-sm">Phone</p>
              <p>+91 98765 43210</p>
            </div>
            <div className="sm:col-span-2">
              <p className="font-medium text-gray-500 text-sm">Bio</p>
              <p>
                Exploring the intersection of science and spirituality — building
                harmony between technology and inner awareness.
              </p>
            </div>
          </div>

          {/* Card actions (save/cancel) - shown as placeholder actions in read mode */}
          <div className="mt-6 flex justify-end gap-3">
            <button className="text-sm text-gray-600 hover:underline">Cancel</button>
            <button className="hidden bg-blue-600 text-white px-4 py-2 rounded-md">Save Changes</button>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white shadow-sm rounded-xl p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Address</h3>
            <div className="flex items-center gap-2">
              <button className="text-sm text-gray-500 hover:text-gray-700">Map</button>
              <button className="text-sm bg-white border border-gray-200 px-3 py-1 rounded-md hover:bg-gray-50">
                Edit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="font-medium text-gray-500 text-sm">Country</p>
              <p>India</p>
            </div>
            <div>
              <p className="font-medium text-gray-500 text-sm">City / State</p>
              <p>Bengaluru, Karnataka</p>
            </div>
            <div>
              <p className="font-medium text-gray-500 text-sm">Postal Code</p>
              <p>560068</p>
            </div>
            <div>
              <p className="font-medium text-gray-500 text-sm">Spiritual ID</p>
              <p>SS-1082025</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button className="text-sm text-gray-600 hover:underline">Cancel</button>
            <button className="hidden bg-blue-600 text-white px-4 py-2 rounded-md">Save Changes</button>
          </div>
        </div>

        {/* Optional quick actions card */}
        <div className="bg-white shadow-sm rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-gray-800">Quick Actions</h4>
            <p className="text-sm text-gray-500">Shortcuts to common tasks</p>
          </div>

          <div className="flex gap-3">
            <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
              Change Password
            </button>
            <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
              Export Data
            </button>
            <button className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-lg hover:bg-red-100">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
