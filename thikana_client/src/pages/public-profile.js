import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../utils/api";
import coverImg from "../assect/images/profile-cover.png";
import defaultProfile from "../assect/images/profile-thumb.png";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(apiUrl(`/api/users/${username}`));
        setUser(res.data.user);
        setProperties(res.data.properties || []);
        setLoading(false);
        // If logged-in user is viewing their own profile, redirect
        const localUser = localStorage.getItem("thikana_user");
        if (localUser) {
          const parsed = JSON.parse(localUser);
          if (parsed.username === username || parsed._id === username) {
            navigate("/profiles", { replace: true });
          }
        }
      } catch (err) {
        setLoading(false);
        setUser(null);
      }
    }
    fetchData();
  }, [username, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <div className="bg-gradient-to-br from-[#f3f4f6] to-[#e0e7ff] min-h-screen">
      <Navbar navClass="defaultscroll sticky top-0 z-50" menuClass="navigation-menu nav-left" />
      <main className="container pt-12" style={{ paddingTop: "130px", paddingBottom: "100px" }}>
        <div className="w-full mb-8 relative">
          <div className="rounded-3xl overflow-hidden shadow-lg w-full">
            <img
              src={user.coverPicture ? (user.coverPicture.startsWith("http") ? user.coverPicture : apiUrl(user.coverPicture)) : coverImg}
              alt="Cover"
              className="w-full h-56 object-cover rounded-3xl"
            />
            {/* Agent Charge badge (top right) */}
            {user.agent === "agent" && user.agentCharge && (
              <div style={{position: 'absolute', top: 20, right: 20, zIndex: 20}}>
                <span className="bg-green-600 text-white px-4 py-2 rounded-full shadow font-semibold text-sm">
                  Agent Charge: ৳{user.agentCharge}
                </span>
              </div>
            )}
            {/* Avatar and name on left, Message button and Book Now (if agent) on right */}
            <div className="absolute left-8 bottom-[-58px] flex items-center gap-4">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-white flex items-center justify-center overflow-hidden shadow-lg">
                <img
                  src={user.profilePicture ? (user.profilePicture.startsWith("http") ? user.profilePicture : apiUrl(user.profilePicture)) : defaultProfile}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-2">
                <h3 className="text-xl mt-5 font-bold text-gray-800">{user.name || "User Name"}</h3>
              </div>
            </div>
            <div className="absolute right-8 top-[250px] flex gap-4">
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-green-700 transition"
                onClick={() => navigate(`/messages/${user._id}`)}
              >
                Message
              </button>
              {user.agent === "agent" && (
                <button
                  className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-green-700 transition"
                  onClick={() => { /* Book Now action here */ }}
                >
                  Book Now
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Property Items */}
        <div className="text-black-700" style={{ paddingTop: "100px" }}>
          <h2 className="text-2xl font-bold mb-6">Properties list</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {properties.length === 0 && <div className="col-span-4 text-gray-500">No properties listed.</div>}
          {properties.map((property) => (
            <div key={property.id || property._id} className="card property border-0 shadow position-relative overflow-hidden rounded-3">
              {property.verified && (
                <span className="badge bg-green-500 text-white absolute top-3 left-3 z-10">Verified</span>
              )}
              <img
                src={property.coverImage
                  ? (property.coverImage.startsWith("http")
                      ? property.coverImage
                      : apiUrl(`/uploads/${property.coverImage}`))
                  : property.image
                    ? (property.image.startsWith("http")
                        ? property.image
                        : apiUrl(`/uploads/${property.image}`))
                    : defaultProfile}
                className="w-full h-48 object-cover rounded-t-3"
                alt={property.title}
              />
              <div className="bg-white p-4 rounded-b-3">
                <h4 className="font-bold text-lg mb-2">{property.title}</h4>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <span className="mr-4 flex items-center">
                    <i className="fas fa-expand text-green-700 mr-1"></i>
                    {property.size} sq.ft
                  </span>
                  <span className="mr-4 flex items-center">
                    <i className="fas fa-bed text-green-700 mr-1"></i>
                    {property.beds} Beds
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-bath text-green-700 mr-1"></i>
                    {property.baths} Baths
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div>
                    <span className="text-gray-500 text-xs">Price</span>
                    <div className="font-bold text-green-700">৳{property.nowPrice || property.price}</div>
                  </div>
                </div>
                {/* No Edit/Delete buttons for public view */}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
