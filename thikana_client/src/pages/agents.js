import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { apiUrl, API_BASE_URL } from "../utils/api";
import Select from "react-select";
import { io } from "socket.io-client";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";

const ALL_DISTRICTS = [
  "Bagerhat", "Bandarban", "Barguna", "Barisal", "Bhola", "Bogra", "Brahmanbaria", "Chandpur", "Chapai Nawabganj", "Chattogram", "Chuadanga", "Comilla", "Cox's Bazar", "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore", "Jhalokathi", "Jhenaidah", "Joypurhat", "Khagrachari", "Khulna", "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet", "Tangail", "Thakurgaon"
];

const ALL_THANA_OPTIONS = {
  Bagerhat: ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"],
  Bandarban: ["Bandarban Sadar", "Thanchi", "Ruma", "Rowangchhari", "Lama", "Alikadam", "Naikhongchhari"],
  Barguna: ["Amtali", "Bamna", "Barguna Sadar", "Betagi", "Patharghata", "Taltali"],
  Barisal: ["Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Gaurnadi", "Hizla", "Barisal Sadar", "Mehendiganj", "Muladi", "Wazirpur"],
  Bhola: ["Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan", "Manpura", "Tazumuddin"],
  Bogra: ["Adamdighi", "Bogra Sadar", "Dhunat", "Dhupchanchia", "Gabtali", "Kahaloo", "Nandigram", "Sariakandi", "Shajahanpur", "Sherpur", "Shibganj", "Sonatala"],
  Brahmanbaria: ["Ashuganj", "Banchharampur", "Brahmanbaria Sadar", "Kasba", "Nabinagar", "Nasirnagar", "Sarail", "Bijoynagar"],
  Chandpur: ["Chandpur Sadar", "Faridganj", "Haimchar", "Haziganj", "Kachua", "Matlab Dakshin", "Matlab Uttar", "Shahrasti"],
  Chapai_Nawabganj: ["Bholahat", "Gomostapur", "Nachole", "Chapai Nawabganj Sadar", "Shibganj"],
  Chattogram: ["Anwara", "Banshkhali", "Boalkhali", "Chandanaish", "Fatikchhari", "Hathazari", "Lohagara", "Mirsharai", "Patiya", "Rangunia", "Raozan", "Sandwip", "Satkania", "Sitakunda", "Chattogram Sadar"],
  Chuadanga: ["Alamdanga", "Chuadanga Sadar", "Damurhuda", "Jibannagar"],
  Comilla: ["Barura", "Brahmanpara", "Burichang", "Chandina", "Chauddagram", "Comilla Sadar", "Comilla Sadar Dakshin", "Daudkandi", "Debidwar", "Homna", "Laksam", "Lalmai", "Meghna", "Monohorgonj", "Muradnagar", "Nangalkot", "Titas"],
  "Cox's Bazar": ["Chakaria", "Cox's Bazar Sadar", "Kutubdia", "Maheshkhali", "Pekua", "Ramu", "Teknaf", "Ukhia"],
  Dhaka: ["Dhanmondi", "Gulshan", "Badda", "Mirpur", "Mohammadpur", "Tejgaon", "Uttara", "Ramna", "Motijheel", "Pallabi", "Khilgaon", "Sabujbagh", "Lalbagh", "Kotwali", "Hazaribagh", "Kamrangirchar", "Shahbagh", "Sher-e-Bangla Nagar", "Kafrul", "Banani", "Airport", "Cantonment", "Shyampur", "Demra", "Jatrabari", "Wari", "Sutrapur"],
  Dinajpur: ["Birampur", "Birganj", "Biral", "Bochaganj", "Chirirbandar", "Dinajpur Sadar", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur"],
  Faridpur: ["Alfadanga", "Bhanga", "Boalmari", "Charbhadrasan", "Faridpur Sadar", "Madhukhali", "Nagarkanda", "Sadarpur", "Saltha"],
  Feni: ["Chhagalnaiya", "Daganbhuiyan", "Feni Sadar", "Fulgazi", "Parshuram", "Sonagazi"],
  Gaibandha: ["Fulchhari", "Gaibandha Sadar", "Gobindaganj", "Palashbari", "Sadullapur", "Saghata", "Sundarganj"],
  Gazipur: ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur"],
  Gopalganj: ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"],
  Habiganj: ["Ajmiriganj", "Bahubal", "Baniachong", "Chunarughat", "Habiganj Sadar", "Lakhai", "Madhabpur", "Nabiganj"],
  Jamalpur: ["Baksiganj", "Dewanganj", "Islampur", "Jamalpur Sadar", "Madarganj", "Melandaha", "Sarishabari"],
  Jashore: ["Abhaynagar", "Bagherpara", "Chaugachha", "Jhikargacha", "Keshabpur", "Jashore Sadar", "Manirampur", "Sharsha"],
  Jhalokathi: ["Jhalokathi Sadar", "Kathalia", "Nalchity", "Rajapur"],
  Jhenaidah: ["Harinakunda", "Jhenaidah Sadar", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa"],
  Joypurhat: ["Akkelpur", "Joypurhat Sadar", "Kalai", "Khetlal", "Panchbibi"],
  Khagrachari: ["Dighinala", "Khagrachhari Sadar", "Lakshmichhari", "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh"],
  Khulna: ["Batiaghata", "Dacope", "Dumuria", "Dighalia", "Khalishpur", "Khan Jahan Ali", "Kotwali", "Paikgachha", "Phultala", "Rupsa", "Terokhada"],
  Kishoreganj: ["Austagram", "Bajitpur", "Bhairab", "Hossainpur", "Itna", "Karimganj", "Katiadi", "Kishoreganj Sadar", "Kuliarchar", "Mithamain", "Nikli", "Pakundia", "Tarail"],
  Kurigram: ["Bhurungamari", "Char Rajibpur", "Chilmari", "Fulbari", "Kurigram Sadar", "Nageshwari", "Rajarhat", "Raomari", "Ulipur"],
  Kushtia: ["Bheramara", "Daulatpur", "Khoksa", "Kumarkhali", "Kushtia Sadar", "Mirpur"],
  Lakshmipur: ["Kamalnagar", "Lakshmipur Sadar", "Raipur", "Ramganj", "Ramgati"],
  Lalmonirhat: ["Aditmari", "Hatibandha", "Kaliganj", "Lalmonirhat Sadar", "Patgram"],
  Madaripur: ["Kalkini", "Madaripur Sadar", "Rajoir", "Shibchar"],
  Magura: ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"],
  Manikganj: ["Daulatpur", "Ghior", "Harirampur", "Manikganj Sadar", "Saturia", "Shibalaya", "Singair"],
  Meherpur: ["Gangni", "Meherpur Sadar", "Mujibnagar"],
  Moulvibazar: ["Barlekha", "Juri", "Kamalganj", "Kulaura", "Moulvibazar Sadar", "Rajnagar", "Sreemangal"],
  Munshiganj: ["Gazaria", "Lohajang", "Munshiganj Sadar", "Sirajdikhan", "Sreenagar", "Tongibari"],
  Mymensingh: ["Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gauripur", "Haluaghat", "Ishwarganj", "Muktagachha", "Mymensingh Sadar", "Nandail", "Phulpur", "Trishal"],
  Naogaon: ["Atrai", "Badalgachhi", "Dhamoirhat", "Manda", "Mahadebpur", "Naogaon Sadar", "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar"],
  Narail: ["Kalia", "Lohagara", "Narail Sadar"],
  Narayanganj: ["Araihazar", "Bandar", "Narayanganj Sadar", "Rupganj", "Sonargaon"],
  Narsingdi: ["Belabo", "Monohardi", "Narsingdi Sadar", "Palash", "Raipura", "Shibpur"],
  Natore: ["Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Natore Sadar", "Singra"],
  Netrokona: ["Atpara", "Barhatta", "Durgapur", "Khaliajuri", "Kalmakanda", "Kendua", "Madan", "Mohanganj", "Netrokona Sadar", "Purbadhala"],
  Nilphamari: ["Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Nilphamari Sadar", "Saidpur"],
  Noakhali: ["Begumganj", "Chatkhil", "Companiganj", "Hatiya", "Kabirhat", "Noakhali Sadar", "Senbagh", "Subarnachar"],
  Pabna: ["Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Ishwardi", "Pabna Sadar", "Santhia", "Sujanagar"],
  Panchagarh: ["Atwari", "Boda", "Debiganj", "Panchagarh Sadar", "Tetulia"],
  Patuakhali: ["Bauphal", "Dashmina", "Dumki", "Galachipa", "Kalapara", "Mirzaganj", "Patuakhali Sadar", "Rangabali"],
  Pirojpur: ["Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad", "Pirojpur Sadar", "Zianagar"],
  Rajbari: ["Baliakandi", "Goalanda", "Kalukhali", "Pangsha", "Rajbari Sadar"],
  Rajshahi: ["Boalia", "Rajpara", "Motihar", "Shah Makhdum", "Paba", "Godagari", "Tanore", "Durgapur", "Bagmara", "Charghat", "Puthia", "Bagha"],
  Rangamati: ["Baghaichhari", "Barkal", "Kawkhali", "Belaichhari", "Kaptai", "Juraichhari", "Langadu", "Naniarchar", "Rajasthali", "Rangamati Sadar"],
  Rangpur: ["Badarganj", "Gangachara", "Kaunia", "Mithapukur", "Pirgachha", "Pirganj", "Rangpur Sadar", "Taraganj"],
  Satkhira: ["Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Satkhira Sadar", "Shyamnagar", "Tala"],
  Shariatpur: ["Bhedarganj", "Damudya", "Gosairhat", "Naria", "Shariatpur Sadar", "Zajira"],
  Sherpur: ["Jhenaigati", "Nakla", "Nalitabari", "Sherpur Sadar", "Sreebardi"],
  Sirajganj: ["Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Raiganj", "Shahjadpur", "Sirajganj Sadar", "Tarash", "Ullapara"],
  Sunamganj: ["Bishwamvarpur", "Chhatak", "Dakshin Sunamganj", "Derai", "Dharampasha", "Dowarabazar", "Jagannathpur", "Jamalganj", "Sullah", "Sunamganj Sadar", "Tahirpur"],
  Sylhet: ["Balaganj", "Beanibazar", "Bishwanath", "Companiganj", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Sylhet Sadar", "Zakiganj"],
  Tangail: ["Basail", "Bhuapur", "Delduar", "Dhaka Sadar", "Dhanbari", "Ghatail", "Gopalpur", "Kalihati", "Madhupur", "Mirzapur", "Nagarpur", "Sakhipur", "Tangail Sadar"],
  Thakurgaon: ["Baliadangi", "Haripur", "Pirganj", "Ranisankail", "Thakurgaon Sadar"]
};

function AgentCard({ agent, status, onBook }) {
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

export default function AgentsPage() {
    const [agents, setAgents] = useState([]);
    const [filteredAgents, setFilteredAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [agentStatuses, setAgentStatuses] = useState({});
    const navigate = useNavigate();
    // Filter states
    const [filterRating, setFilterRating] = useState(0);
    const [filterCharge, setFilterCharge] = useState(0);
    const [filterThana, setFilterThana] = useState("");
    const [filterDistinct, setFilterDistinct] = useState("");
    const minCharge = 0;
    const maxCharge = 5000;

    useEffect(() => {
        async function fetchAgents() {
            setLoading(true);
            setError("");
            try {
                const res = await fetch(apiUrl("/api/users"));
                const data = await res.json();
                let agentList = (data.users || []).filter(u => u.agent === "agent");
                // Fetch and attach average rating for each agent
                const agentsWithRating = await Promise.all(agentList.map(async agent => {
                    try {
                        const avgRes = await fetch(apiUrl(`/api/agent/${agent._id}/rating/average`));
                        const avgData = await avgRes.json();
                        agent._avgRating = avgData.averageRating ? avgData.averageRating : 0;
                    } catch {
                        agent._avgRating = 0;
                    }
                    return agent;
                }));
                setAgents(agentsWithRating);
            } catch (err) {
                setError("Failed to load agents");
            } finally {
                setLoading(false);
            }
        }
        fetchAgents();
    }, []);

    // Unified real-time filter
    useEffect(() => {
        let filtered = agents.filter(agent => {
            const charge = Number(agent.agentCharge) || 0;
            const chargeMatch = charge >= filterCharge;
            // Strict, case-insensitive match for distinct
            const distinctMatch = !filterDistinct || (agent.distinct && agent.distinct.toLowerCase() === filterDistinct.toLowerCase());
            // Strict, case-insensitive match for thana
            const thanaMatch = !filterThana || (agent.thana && agent.thana.toLowerCase() === filterThana.toLowerCase());
            const ratingMatch = agent._avgRating >= filterRating;
            return chargeMatch && distinctMatch && thanaMatch && ratingMatch;
        });
        setFilteredAgents(filtered);
    }, [agents, filterCharge, filterDistinct, filterThana, filterRating]);

    // Reset filters function
    const resetFilters = () => {
        setFilterRating(0);
        setFilterCharge(0);
        setFilterThana("");
        setFilterDistinct("");
    };

    useEffect(() => {
        if (!agents.length) return;
        const socket = io(API_BASE_URL, { autoConnect: true, reconnection: true });
        const agentIds = agents.map(a => a._id);
        socket.emit("check-multiple-user-status", agentIds);
        socket.on("multiple-user-status", (statuses) => {
            setAgentStatuses(statuses || {});
        });
        // Optionally poll every 30s for real-time updates
        const interval = setInterval(() => {
            socket.emit("check-multiple-user-status", agentIds);
        }, 30000);
        return () => {
            clearInterval(interval);
            socket.disconnect();
        };
    }, [agents]);

    return (
        <>
            <Navbar navClass="defaultscroll sticky" menuClass="navigation-menu nav-left" />
            <div className="container" style={{ marginBottom: "50px", marginTop: "100px" }}>
                <div className="row g-4 flex flex-col lg:flex-row">
                    {/* Sidebar */}
                    <div className="col-lg-4 col-md-6 col-12 w-full lg:w-1/3 mb-4 lg:mb-0">
                        <div className="card bg-white p-4 rounded-4 shadow sticky-bar border border-gray-200" style={{boxShadow:'0 2px 16px 0 #e5e7eb'}}>
                            <h5 className="mb-4 font-bold text-lg text-green-700 flex items-center gap-2"><i className="mdi mdi-filter-variant"></i> Filter Agents</h5>
                            {/* Rating Slider */}
                            <div className="mb-4">
                                <label className="mb-1 font-semibold">Minimum Rating</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">0</span>
                                    <input
                                        type="range"
                                        className="form-range flex-1 accent-green-600"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={filterRating}
                                        onChange={e => setFilterRating(Number(e.target.value))}
                                    />
                                    <span className="text-xs text-gray-500">5</span>
                                </div>
                                <div className="text-green-700 font-bold text-sm mt-1">From {filterRating} ★</div>
                            </div>
                            {/* Service Charge Slider */}
                            <div className="mb-4">
                                <label className="mb-1 font-semibold">Minimum Service Charge</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">৳{minCharge}</span>
                                    <input
                                        type="range"
                                        className="form-range flex-1 accent-green-600"
                                        min={minCharge}
                                        max={maxCharge}
                                        step="1"
                                        value={filterCharge}
                                        onChange={e => setFilterCharge(Number(e.target.value))}
                                    />
                                    <span className="text-xs text-gray-500">৳{maxCharge}</span>
                                </div>
                                <div className="text-green-700 font-bold text-sm mt-1">From ৳{filterCharge}</div>
                            </div>
                            {/* Distinct Dropdown (react-select) */}
                            <div className="mb-4">
                                <label className="mb-1 font-semibold">Distinct</label>
                                <Select
                                    name="distinct"
                                    value={filterDistinct ? { value: filterDistinct, label: filterDistinct } : null}
                                    onChange={option => {
                                        setFilterDistinct(option ? option.value : "");
                                        setFilterThana("");
                                    }}
                                    options={ALL_DISTRICTS.map(d => ({ value: d, label: d }))}
                                    isClearable
                                    isSearchable
                                    placeholder="Select or search district"
                                />
                            </div>
                            {/* Thana Dropdown (react-select) */}
                            <div className="mb-4">
                                <label className="mb-1 font-semibold">Thana</label>
                                <Select
                                    name="thana"
                                    value={filterThana ? { value: filterThana, label: filterThana } : null}
                                    onChange={option => setFilterThana(option ? option.value : "")}
                                    options={filterDistinct && ALL_THANA_OPTIONS[filterDistinct] ? ALL_THANA_OPTIONS[filterDistinct].map(thana => ({ value: thana, label: thana })) : []}
                                    isClearable
                                    isSearchable
                                    placeholder="Select or search thana"
                                    isDisabled={!filterDistinct}
                                />
                            </div>
                            {/* Reset Button */}
                            <div className="mt-6 flex justify-center">
                                <button type="button" className="btn btn-outline-success px-4 py-2 rounded-full font-semibold border border-green-600 text-green-700 hover:bg-green-50 transition" onClick={resetFilters}>
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Agent Cards */}
                    <div className="col-lg-8 col-md-6 col-12 w-full lg:w-2/3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-0">
                            {loading ? (
                                <div className="w-full text-center text-gray-500 py-8 text-lg">Loading agents...</div>
                            ) : error ? (
                                <div className="w-full text-center text-red-500 py-8 text-lg">{error}</div>
                            ) : filteredAgents.length === 0 ? (
                                <div className="w-full text-center text-gray-500 py-8 text-lg">No agents found.</div>
                            ) : (
                                filteredAgents.map((agent, index) => (
                                    <Link key={agent._id || index} to={`/public-profile/${agent.username || agent._id}`} className="block">
                                        <AgentCard agent={agent} status={agentStatuses[agent._id]} onBook={e => {
                                            e.stopPropagation();
                                            navigate(`/book-agent/${agent._id}`);
                                        }} />
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}