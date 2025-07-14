import React from "react";
import { Link } from "react-router-dom";
import defaultProfile from "../assect/images/profile-thumb.png";
import { apiUrl } from "../utils/api";

export default function PropertyListTab({ properties, onEdit, onDelete }) {
  return (
    <div>
      <div className="text-black-700">
        <h2 className="text-2xl font-bold mb-6">My Properties</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
        {properties.map((property) => (
          <div key={property.id || property._id} className="card property border-0 shadow position-relative overflow-hidden rounded-3">
            {property.verified && (
              <span className="badge bg-green-500 text-white absolute top-3 left-3 z-10">Verified</span>
            )}
            <img
              src={property.image ? (property.image.startsWith('http') ? property.image : apiUrl(property.image)) : defaultProfile}
              className="w-full h-48 object-cover rounded-t-3"
              alt={property.title}
            />
            <div className="bg-white p-4 rounded-b-3">
              <h4 className="font-bold text-lg mb-2">
                <Link
                  to={`/property-detail/${property._id || property.id}`}
                  className="hover:text-green-800 text-black transition-colors duration-200"
                  style={{ textDecoration: 'none' }}
                >
                  {property.title}
                </Link>
              </h4>
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <span className="mr-4 flex items-center"><i className="fas fa-expand text-green-700 mr-1"></i>{property.size} sq.ft</span>
                <span className="mr-4 flex items-center"><i className="fas fa-bed text-green-700 mr-1"></i>{property.beds} Beds</span>
                <span className="flex items-center"><i className="fas fa-bath text-green-700 mr-1"></i>{property.baths} Baths</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div>
                  <span className="text-gray-500 text-xs">Price</span>
                  <div className="font-bold text-green-700">৳{property.nowPrice || property.price}</div>
                </div>
              </div>
              {/* Edit/Delete Buttons */}
              <div className="flex gap-2 absolute bottom-4 right-4 z-20">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-semibold text-sm shadow"
                  onClick={() => onEdit(property)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-semibold text-sm shadow"
                  onClick={() => onDelete(property)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}