import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { apiUrl } from "../utils/api";
import Select from "react-select";

const ALL_DISTRICTS = [
  "Bagerhat", "Bandarban", "Barguna", "Barisal", "Bhola", "Bogra", "Brahmanbaria", "Chandpur", "Chapai Nawabganj", "Chattogram", "Chuadanga", "Comilla", "Cox's Bazar", "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore", "Jhalokathi", "Jhenaidah", "Joypurhat", "Khagrachari", "Khulna", "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet", "Tangail", "Thakurgaon"
];

// Official mapping of all Bangladesh districts to their thanas (upazilas)
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

export default function BecomeAgentTab({ user, onUpdate }) {
  const [form, setForm] = useState({
    fullAddress: user?.fullAddress || "",
    distinct: user?.distinct || "",
    thana: user?.thana || "",
    zip: user?.zip || "",
    bkash: user?.bkash || "",
    agentCharge: user?.agentCharge || "",
    nidFront: null,
    nidBack: null,
    profilePicture: null,
    coverPicture: null,
  });
  const [profilePreview, setProfilePreview] = useState(user?.profilePicture ? (user.profilePicture.startsWith('http') ? user.profilePicture : apiUrl(user.profilePicture)) : null);
  const [coverPreview, setCoverPreview] = useState(user?.coverPicture ? (user.coverPicture.startsWith('http') ? user.coverPicture : apiUrl(user.coverPicture)) : null);
  const [nidFrontPreview, setNidFrontPreview] = useState(null);
  const [nidBackPreview, setNidBackPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Dropzone for NID Front
  const { getRootProps: getNidFrontRootProps, getInputProps: getNidFrontInputProps, isDragActive: isNidFrontDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: files => {
      setForm(f => ({ ...f, nidFront: files[0] }));
      setNidFrontPreview(URL.createObjectURL(files[0]));
    }
  });
  // Dropzone for NID Back
  const { getRootProps: getNidBackRootProps, getInputProps: getNidBackInputProps, isDragActive: isNidBackDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: files => {
      setForm(f => ({ ...f, nidBack: files[0] }));
      setNidBackPreview(URL.createObjectURL(files[0]));
    }
  });
  // Dropzone for profile picture
  const { getRootProps: getProfileRootProps, getInputProps: getProfileInputProps, isDragActive: isProfileDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: files => {
      setForm(f => ({ ...f, profilePicture: files[0] }));
      setProfilePreview(URL.createObjectURL(files[0]));
    }
  });
  // Dropzone for cover picture
  const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps, isDragActive: isCoverDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: files => {
      setForm(f => ({ ...f, coverPicture: files[0] }));
      setCoverPreview(URL.createObjectURL(files[0]));
    }
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const formData = new FormData();
      // Always use the actual File object for upload, not preview URL
      formData.append("fullAddress", form.fullAddress);
      formData.append("distinct", form.distinct);
      formData.append("thana", form.thana);
      formData.append("zip", form.zip);
      formData.append("bkash", form.bkash);
      formData.append("agentCharge", form.agentCharge);
      if (form.nidFront instanceof File) formData.append("nidFront", form.nidFront);
      if (form.nidBack instanceof File) formData.append("nidBack", form.nidBack);
      if (form.profilePicture instanceof File) formData.append("profilePicture", form.profilePicture);
      if (form.coverPicture instanceof File) formData.append("coverPicture", form.coverPicture);
      formData.append("agent", "agent");
      const token = localStorage.getItem("thikana_token");
      await axios.post(apiUrl("/api/user/profile"), formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Profile updated! You are now an agent.");
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Distinct and Thana dropdown logic
  const [selectedDistinct, setSelectedDistinct] = useState(user?.distinct || "");
  const [thanaList, setThanaList] = useState([]);

  useEffect(() => {
    if (selectedDistinct && ALL_THANA_OPTIONS[selectedDistinct]) {
      setThanaList(ALL_THANA_OPTIONS[selectedDistinct]);
      // If current thana is not in the new list, reset it
      if (!ALL_THANA_OPTIONS[selectedDistinct].includes(form.thana)) {
        setForm(f => ({ ...f, thana: "" }));
      }
    } else {
      setThanaList([]);
      setForm(f => ({ ...f, thana: "" }));
    }
  }, [selectedDistinct]);

  // Always keep form in sync with latest user prop
  useEffect(() => {
    setForm(f => ({
      ...f,
      fullAddress: user?.fullAddress || "",
      distinct: user?.distinct || "",
      thana: user?.thana || "",
      zip: user?.zip || "",
      bkash: user?.bkash || "",
      agentCharge: user?.agentCharge !== undefined && user?.agentCharge !== null ? String(user.agentCharge) : "",
    }));
    setProfilePreview(user?.profilePicture ? (user.profilePicture.startsWith('http') ? user.profilePicture : apiUrl(user.profilePicture)) : null);
    setCoverPreview(user?.coverPicture ? (user.coverPicture.startsWith('http') ? user.coverPicture : apiUrl(user.coverPicture)) : null);
    setNidFrontPreview(user?.nidFront ? (user.nidFront.startsWith('http') ? user.nidFront : apiUrl(user.nidFront)) : null);
    setNidBackPreview(user?.nidBack ? (user.nidBack.startsWith('http') ? user.nidBack : apiUrl(user.nidBack)) : null);
  }, [user]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto bg-white rounded-xl shadow p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Become an Agent</h2>
      {/* Profile & Cover Picture Upload */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block font-semibold mb-1">Profile Picture <span className="text-red-500">*</span></label>
          <div {...getProfileRootProps()} className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors duration-200 ${isProfileDragActive ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'}`}>
            <input {...getProfileInputProps()} />
            {profilePreview ? (
              <img src={profilePreview} alt="Profile Preview" className="mx-auto h-24 w-auto object-contain rounded-full shadow mb-2" />
            ) : (
              <span className="text-gray-500">Drag & drop or click to select profile image</span>
            )}
          </div>
        </div>
        <div className="flex-1">
          <label className="block font-semibold mb-1">Cover Picture <span className="text-red-500">*</span></label>
          <div {...getCoverRootProps()} className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors duration-200 ${isCoverDragActive ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'}`}>
            <input {...getCoverInputProps()} />
            {coverPreview ? (
              <img src={coverPreview} alt="Cover Preview" className="mx-auto h-24 w-auto object-contain rounded shadow mb-2" />
            ) : (
              <span className="text-gray-500">Drag & drop or click to select cover image</span>
            )}
          </div>
        </div>
      </div>
      {/* Full Address */}
      <div>
        <label className="block font-semibold mb-1">Full Address</label>
        <input className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} name="fullAddress" value={form.fullAddress} onChange={handleChange} required />
      </div>
      <div className="flex gap-4">
      {/* Distinct Dropdown */}
      <div className="flex-1">
        <label className="block font-semibold mb-1">Distinct</label>
        <Select
          name="distinct"
          value={selectedDistinct ? { value: selectedDistinct, label: selectedDistinct } : null}
          onChange={option => {
            setSelectedDistinct(option ? option.value : "");
            setForm(f => ({ ...f, distinct: option ? option.value : "", thana: "" }));
          }}
          options={ALL_DISTRICTS.map(d => ({ value: d, label: d }))}
          isClearable
          isSearchable
          placeholder="Select or search district"
        />
      </div>
      {/* Thana Dropdown (react-select) */}
      <div className="flex-1">
        <label className="block font-semibold mb-1">Thana</label>
        <Select
          name="thana"
          value={form.thana ? { value: form.thana, label: form.thana } : null}
          onChange={option => setForm(f => ({ ...f, thana: option ? option.value : "" }))}
          options={thanaList.map(thana => ({ value: thana, label: thana }))}
          isClearable
          isSearchable
          placeholder="Select or search thana"
          isDisabled={!selectedDistinct}
        />
      </div>
      </div>
      <div className="flex gap-4">
      {/* Bkash Number */}
      <div className="flex-1">
        <label className="block font-semibold mb-1">Bkash Number</label>
        <input className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} name="bkash" value={form.bkash} onChange={handleChange} required />
      </div>
      {/* Agent Charge */}
      <div className="flex-1">
        <label className="block font-semibold mb-1">Set Agent Charge (৳)</label>
        <input type="number" className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} name="agentCharge" value={form.agentCharge} onChange={handleChange} required min="0" />
      </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-semibold mb-1">Upload NID Front</label>
          <div {...getNidFrontRootProps()} className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors duration-200 ${isNidFrontDragActive ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'}`}>
            <input {...getNidFrontInputProps()} />
            {nidFrontPreview ? (
              <img src={nidFrontPreview} alt="NID Front Preview" className="mx-auto h-24 w-auto object-contain rounded shadow mb-2" />
            ) : (
              <span className="text-gray-500">Drag & drop or click to select NID front image</span>
            )}
          </div>
        </div>
        <div className="flex-1">
          <label className="block font-semibold mb-1">Upload NID Back</label>
          <div {...getNidBackRootProps()} className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors duration-200 ${isNidBackDragActive ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'}`}>
            <input {...getNidBackInputProps()} />
            {nidBackPreview ? (
              <img src={nidBackPreview} alt="NID Back Preview" className="mx-auto h-24 w-auto object-contain rounded shadow mb-2" />
            ) : (
              <span className="text-gray-500">Drag & drop or click to select NID back image</span>
            )}
          </div>
        </div>
      </div>
      {success && <div className="text-green-600 font-bold">{success}</div>}
      {error && <div className="text-red-600 font-bold">{error}</div>}
      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold w-full" disabled={loading}>
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}