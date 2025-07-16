import React, { useEffect, useState } from "react";
import { apiUrl, API_BASE_URL } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import moment from "moment";

function AgentCard({ agent, status, onBook }) {
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
        <div className="bg-gradient-to-br from-green-50 to-white rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all border border-gray-100 p-7 w-full max-w-sm flex flex-col items-center cursor-pointer group relative overflow-hidden">
            <div className="flex flex-col items-center w-full">
                <div className="relative mb-2">
                    <img
                        src={agent.profilePicture ? (agent.profilePicture.startsWith('http') ? agent.profilePicture : apiUrl(agent.profilePicture)) : process.env.PUBLIC_URL + '/default-profile.png'}
                        alt={agent.name}
                        className={`w-24 h-24 rounded-full object-cover border-4 shadow-lg group-hover:scale-110 transition-transform duration-200 ${status && status.online ? 'border-green-500' : 'border-gray-400'}`}
                        style={{ boxShadow: status && status.online ? '0 0 0 4px #bbf7d0' : '0 0 0 4px #e5e7eb' }}
                    />
                    <span className={`absolute right-2 bottom-2 w-5 h-5 border-2 border-white rounded-full z-50 animate-pulse ${status && status.online ? 'bg-green-500' : 'bg-gray-400'}`}
                        title={status && status.online ? 'Online' : 'Offline'}
                    ></span>
                    {status && (
                        <span className={`absolute left-2 top-2 px-2 py-0.5 rounded-full text-xs font-bold shadow ${status.online ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-200 text-gray-600 border border-gray-300'}`}>{status.online ? 'Online' : 'Offline'}</span>
                    )}
                </div>
                <span className="text-xl font-extrabold text-gray-900 mb-1 tracking-tight text-center w-full truncate">{agent.name || agent.username}</span>
                {status && (
                    <div className="text-xs text-gray-500 mb-1 text-center w-full">
                        {status.online ? (
                            <span className="text-green-600 font-semibold">Active now</span>
                        ) : status.lastSeen ? (
                            <span>Last seen {moment(status.lastSeen).fromNow()}</span>
                        ) : (
                            <span>Offline</span>
                        )}
                    </div>
                )}
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-yellow-400 text-lg drop-shadow">★</span>
                    <span className="font-bold text-gray-800 text-base">{avgRating}</span>
                    <span className="text-gray-500 text-xs">({ratingCount} reviews)</span>
                </div>
                <div className="w-full text-center mb-2">
                    <span className="block text-sm text-gray-600 font-medium truncate">{agent.address || agent.fullAddress || "No address"}</span>
                    <span className="block text-xs text-gray-500">Thana: {agent.thana || "N/A"}</span>
                </div>
                {agent.agentCharge && (
                    <div className="w-full text-green-700 font-bold text-base mb-4 text-center bg-green-50 rounded-lg py-2 shadow-inner">৳ {agent.agentCharge} <span className="text-xs font-normal text-gray-600">/ service</span></div>
                )}
            </div>
            <button
                className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-full shadow w-full mt-auto transition-all duration-200 text-lg tracking-wide"
                onClick={onBook}
            >
                <span className="inline-flex items-center gap-2">
                     Book Now
                </span>
            </button>
        </div>
    );
}

export default function Broker() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [agentStatuses, setAgentStatuses] = useState({});
    const navigate = useNavigate();

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

    useEffect(() => {
        if (!agents.length) return;
        const socket = io(API_BASE_URL, { autoConnect: true, reconnection: true });
        const agentIds = agents.map(a => a._id);
        socket.emit("check-multiple-user-status", agentIds);
        socket.on("multiple-user-status", (statuses) => {
            setAgentStatuses(statuses || {});
        });
        const interval = setInterval(() => {
            socket.emit("check-multiple-user-status", agentIds);
        }, 30000);
        return () => {
            clearInterval(interval);
            socket.disconnect();
        };
    }, [agents]);

    // Show only 6 latest agents, sorted by createdAt (descending)
    const sortedAgents = [...agents]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 6);
    // Split into 2 rows, 3 agents per row
    const rows = [
        sortedAgents.slice(0, 3),
        sortedAgents.slice(3, 6)
    ];

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
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col gap-12 w-full">
                        {rows.map((row, rowIdx) => (
                            <div key={rowIdx} className="flex flex-row gap-8 w-full justify-center">
                                {row.map((agent, index) => (
                                    <div key={agent._id || index} className="flex-1 min-w-0 max-w-sm flex justify-center">
                                        <Link
                                            to={`/public-profile/${agent.username || agent._id}`}
                                            className="block w-full h-full"
                                        >
                                            <AgentCard
                                                agent={agent}
                                                status={agentStatuses[agent._id]}
                                                onBook={e => {
                                                    e.stopPropagation();
                                                    window.open(`/book-agent/${agent._id}`, '_blank');
                                                }}
                                            />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-8">
                        <button
                            className="btn btn-primary px-6 py-2 font-semibold rounded-full shadow"
                            onClick={() => navigate('/agents')}
                        >
                            View More Agents <i className="mdi mdi-arrow-right align-middle"></i>
                        </button>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}