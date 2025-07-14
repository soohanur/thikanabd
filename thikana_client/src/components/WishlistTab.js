import React from "react";
import { Link } from "react-router-dom";
import defaultProfile from "../assect/images/profile-thumb.png";
import { apiUrl } from "../utils/api";

export default function WishlistTab({ wishlist, onRemove }) {
  return (
    <div>
      <div className="text-black-700">
        <h2 className="text-2xl font-bold mb-6">Wishlist</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
        {wishlist.length === 0 ? (
          <div className="col-span-4 text-center text-gray-500">No properties in your wishlist yet.</div>
        ) : wishlist.map((property) => (
          <div key={property.id || property._id} className="card property border-0 shadow position-relative overflow-hidden rounded-3">
            {property.verified && (
              <span className="badge bg-green-500 text-white absolute top-3 left-3 z-10">Verified</span>
            )}
            <img
              src={
                property.coverImage
                  ? (property.coverImage.startsWith('http')
                      ? property.coverImage
                      : apiUrl(`/uploads/${property.coverImage}`))
                  : property.image
                    ? (property.image.startsWith('http')
                        ? property.image
                        : apiUrl(property.image))
                    : defaultProfile
              }
              className="w-full h-48 object-cover rounded-t-3"
              alt={property.title}
            />
            <div className="bg-white p-4 rounded-b-3">
              <Link
                to={`/property-detail/${property._id || property.id}`}
                className="font-bold text-lg mb-2 text-green-800 hover:underline block"
              >
                {property.title}
              </Link>
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
                <button
                  className="ml-auto bg-red-800 hover:bg-red-700 text-white mt-[20px] px-4 py-1 rounded font-semibold text-sm shadow"
                  onClick={() => onRemove(property)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}