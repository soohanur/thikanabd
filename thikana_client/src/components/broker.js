import React, { useEffect, useState } from "react";
import { apiUrl } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";

function AgentCard({ agent }) {
    const navigate = useNavigate();
    const [avgRating, setAvgRating] = useState(null);
    const [ratingCount, setRatingCount] = useState(null);

    useEffect(() => {
        async function fetchRating() {
            try {
                const avgRes = await fetch(apiUrl(`/api/agent/${agent._id}/rating/average`));
                const avgData = await avgRes.json();
                setAvgRating(avgData.averageRating ? avgData.averageRating.toFixed(1) : "0.0");
                const countRes = await fetch(apiUrl(`/api/agent/${agent._id}/ratings`));
                const countData = await countRes.json();
                setRatingCount(Array.isArray(countData) ? countData.length : 0);
            } catch {
                setAvgRating("0.0");
                setRatingCount(0);
            }
        }
        if (agent._id) fetchRating();
    }, [agent._id]);

    return (
        <div
            className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow border border-gray-100 p-7 w-full max-w-sm flex flex-col items-center cursor-pointer group relative"
        >
            <div className="flex flex-col items-center w-full">
                <img
                    src={agent.profilePicture ? (agent.profilePicture.startsWith('http') ? agent.profilePicture : apiUrl(agent.profilePicture)) : process.env.PUBLIC_URL + '/default-profile.png'}
                    alt={agent.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-green-500 shadow mb-4 group-hover:scale-105 transition-transform duration-200"
                />
                <span className="text-xl font-bold text-gray-900 mb-1 tracking-tight">{agent.name || agent.username}</span>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="font-semibold text-gray-800 text-base">{avgRating}</span>
                    <span className="text-gray-500 text-sm">({ratingCount} reviews)</span>
                </div>
                <div className="w-full text-center mb-2">
                    <span className="block text-sm text-gray-600 font-medium">{agent.address || agent.fullAddress || "No address"}</span>
                    <span className="block text-sm text-gray-500">Thana: {agent.thana || "N/A"}</span>
                </div>
                {agent.agentCharge && (
                    <div className="w-full text-green-700 font-bold text-base mb-4 text-center bg-green-50 rounded-lg py-2">৳ {agent.agentCharge} <span className="text-xs font-normal text-gray-600">/ service</span></div>
                )}
            </div>
            <button
                className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-full shadow w-full mt-auto transition-all duration-200 text-lg tracking-wide"
                onClick={() => window.open(`http://localhost:3000/book-agent/${agent._id}`, '_blank')}
            >
                Book Now
            </button>
        </div>
    );
}

export default function Broker() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchAgents() {
            setLoading(true);
            setError("");
            try {
                const res = await fetch(apiUrl("/api/users"));
                const data = await res.json();
                // Filter for agents only
                const agentList = (data.users || []).filter(u => u.agent === "agent");
                setAgents(agentList);
            } catch (err) {
                setError("Failed to load agents");
            } finally {
                setLoading(false);
            }
        }
        fetchAgents();
    }, []);

    return (
        <React.Fragment>
            <div className="row justify-content-center">
                <div className="col">
                    <div className="section-title text-center mb-4 pb-2">
                        <h4 className="title mb-3 font-bold text-2xl text-gray-800">Meet Our Agents</h4>
                        <p className="text-muted para-desc mb-0 mx-auto text-base">Connect with experienced agents to buy, sell, or rent properties effortlessly. Enjoy a seamless experience with no hidden fees.</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center text-gray-500 py-8 text-lg">Loading agents...</div>
            ) : error ? (
                <div className="text-center text-red-500 py-8 text-lg">{error}</div>
            ) : (
                <div className="flex flex-wrap gap-6 justify-center mt-0">
                    {agents.length === 0 ? (
                        <div className="w-full text-center text-gray-500 py-8 text-lg">No agents found.</div>
                    ) : (
                        agents.map((agent, index) => (
                            <div
                                className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 flex justify-center mb-6"
                                key={agent._id || index}
                            >
                                <AgentCard agent={agent} />
                            </div>
                        ))
                    )}
                </div>
            )}
        </React.Fragment>
    );
}