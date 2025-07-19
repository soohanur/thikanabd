import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import LeafletLocationPicker from "../components/LeafletLocationPicker";
import { apiUrl } from "../utils/api";
import Select from "react-select";

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

const categoryOptions = [
  { value: "Houses", label: "Houses" },
  { value: "Apartment", label: "Apartment" },
  { value: "Offices", label: "Offices" },
  { value: "Sub-let", label: "Sub-let" },
];
const propertyTypeOptions = [
  { value: "Family", label: "Family" },
  { value: "Bachelor", label: "Bachelor" },
  { value: "Office", label: "Office" },
];
const bedBathOptions = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

export default function PostPropertyTab({ user, onSuccess, editProperty }) {
  const [tab, setTab] = useState("rent");
  const [form, setForm] = useState({
    type: "rent",
    title: "",
    description: "",
    price: "",
    location: "Dhaka",
    area: "",
    category: "",
    propertyType: "",
    beds: "1",
    baths: "1",
    size: "",
    coverImage: null,
    galleryImages: [],
    map: "",
    beforePrice: "",
    status: "",
  });
  const [selectedDistinct, setSelectedDistinct] = useState(form.location || "");
  const [thanaList, setThanaList] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [mapCoords, setMapCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editProperty) {
      setForm({
        ...form,
        ...editProperty,
        beds: editProperty.beds ? String(editProperty.beds) : "1",
        baths: editProperty.baths ? String(editProperty.baths) : "1",
        coverImage: null,
        galleryImages: [],
        map: editProperty.map || "",
        beforePrice: editProperty.beforePrice || "",
        status: editProperty.status || "",
      });
      if (editProperty.image) {
        setMainImagePreview(editProperty.image.startsWith("http") ? editProperty.image : apiUrl(editProperty.image));
      } else if (editProperty.coverImage) {
        setMainImagePreview(editProperty.coverImage.startsWith("http") ? editProperty.coverImage : apiUrl(`/uploads/${editProperty.coverImage}`));
      } else {
        setMainImagePreview(null);
      }
      if (editProperty.galleryImages && Array.isArray(editProperty.galleryImages)) {
        setGalleryPreviews(editProperty.galleryImages.map(img => img.startsWith("http") ? img : apiUrl(`/uploads/${img}`)));
      } else {
        setGalleryPreviews([]);
      }
      if (editProperty.map && typeof editProperty.map === "object") {
        setMapCoords(editProperty.map);
      }
    }
    // eslint-disable-next-line
  }, [editProperty]);

  useEffect(() => {
    if (selectedDistinct && ALL_THANA_OPTIONS[selectedDistinct]) {
      setThanaList(ALL_THANA_OPTIONS[selectedDistinct]);
      if (!ALL_THANA_OPTIONS[selectedDistinct].includes(form.area)) {
        setForm(f => ({ ...f, area: "" }));
      }
    } else {
      setThanaList([]);
      setForm(f => ({ ...f, area: "" }));
    }
  }, [selectedDistinct]);

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (name === "coverImage") {
        setForm(f => ({ ...f, coverImage: files[0] }));
        setMainImagePreview(URL.createObjectURL(files[0]));
      } else if (name === "galleryImages") {
        setForm(f => ({ ...f, galleryImages: Array.from(files) }));
        setGalleryPreviews(Array.from(files).map(f => URL.createObjectURL(f)));
      }
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleTab = t => {
    setTab(t);
    setForm(f => ({ ...f, type: t }));
  };

  const handleMapChange = coords => {
    setMapCoords(coords);
    setForm(f => ({ ...f, map: coords }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "galleryImages" && Array.isArray(v)) {
          v.forEach(img => {
            if (img instanceof File) formData.append("galleryImages", img);
          });
        } else if (k === "coverImage" && v instanceof File) {
          formData.append("coverImage", v);
        } else if (k === "map" && typeof v === "object" && v !== null) {
          formData.append("map", JSON.stringify(v));
        } else if (k !== "_id" && v && k !== "galleryImages" && k !== "coverImage") {
          formData.append(k, v);
        }
      });
      const token = localStorage.getItem("thikana_token");
      if (editProperty && editProperty._id) {
        await fetch(apiUrl(`/api/properties/${editProperty._id}`), {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        setSuccess("Property updated successfully!");
      } else {
        await fetch(apiUrl("/api/properties"), {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        setSuccess("Property posted successfully!");
      }
      setForm({
        type: tab,
        title: "",
        description: "",
        price: "",
        location: "Dhaka",
        area: "",
        category: "",
        propertyType: "",
        beds: "1",
        baths: "1",
        size: "",
        coverImage: null,
        galleryImages: [],
        map: "",
        beforePrice: "",
        status: "",
      });
      setMainImagePreview(null);
      setGalleryPreviews([]);
      setMapCoords(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Failed to post property");
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps, isDragActive: isCoverDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: files => {
      setForm(f => ({ ...f, coverImage: files[0] }));
      setMainImagePreview(URL.createObjectURL(files[0]));
    }
  });
  const { getRootProps: getGalleryRootProps, getInputProps: getGalleryInputProps, isDragActive: isGalleryDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: true,
    onDrop: files => {
      setForm(f => ({ ...f, galleryImages: files }));
      setGalleryPreviews(Array.from(files).map(f => URL.createObjectURL(f)));
    }
  });

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
      <div className="flex gap-2 mb-8">
        <button
          className={`px-6 py-2 w-full rounded-t-lg font-bold ${tab === "rent" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}
          onClick={() => handleTab("rent")}
        >
          Rent
        </button>
        <button
          className={`px-6 py-2 w-full rounded-t-lg font-bold ${tab === "buy" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}
          onClick={() => handleTab("buy")}
        >
          Buy
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} name="description" value={form.description} onChange={handleChange} required />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Distinct</label>
            <Select
              name="location"
              value={selectedDistinct ? { value: selectedDistinct, label: selectedDistinct } : null}
              onChange={option => {
                setSelectedDistinct(option ? option.value : "");
                setForm(f => ({ ...f, location: option ? option.value : "", area: "" }));
              }}
              options={ALL_DISTRICTS.map(d => ({ value: d, label: d }))}
              isClearable
              isSearchable
              placeholder="Select or search district"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Thana</label>
            <Select
              name="area"
              value={form.area ? { value: form.area, label: form.area } : null}
              onChange={option => setForm(f => ({ ...f, area: option ? option.value : "" }))}
              options={selectedDistinct && ALL_THANA_OPTIONS[selectedDistinct] ? ALL_THANA_OPTIONS[selectedDistinct].map(thana => ({ value: thana, label: thana })) : []}
              isClearable
              isSearchable
              placeholder="Select or search thana"
              isDisabled={!selectedDistinct}
            />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <select className="form-select w-full" name="category" value={form.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categoryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Property Type</label>
          <select className="form-select w-full" name="propertyType" value={form.propertyType} onChange={handleChange} required>
            <option value="">Select Property Type</option>
            {propertyTypeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Beds</label>
            <select className="form-select w-full" name="beds" value={form.beds} onChange={handleChange} required>
              {bedBathOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Baths</label>
            <select className="form-select w-full" name="baths" value={form.baths} onChange={handleChange} required>
              {bedBathOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Size (sq.ft)</label>
            <input className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', paddingLeft: '10px',paddingTop:'6px',paddingBottom:'6px' }} name="size" value={form.size} onChange={handleChange} required />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Rent (৳/Month)</label>
            <input type="number" className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} name="price" value={form.price} onChange={handleChange} required min="0" />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Previous Rent (৳/Month)</label>
            <input type="number" className="form-input w-full" style={{ border: '1px solid rgb(230, 230, 230)', borderRadius: '8px', padding: '10px' }} name="beforePrice" value={form.beforePrice} onChange={handleChange} min="0" />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Main Image</label>
          <div {...getCoverRootProps()} className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors duration-200 ${isCoverDragActive ? "bg-green-50 border-green-500" : "bg-gray-50 border-gray-300"}`}>
            <input {...getCoverInputProps()} name="coverImage" />
            {mainImagePreview ? (
              <img src={mainImagePreview} alt="Main Preview" className="mx-auto h-32 w-auto object-contain rounded shadow mb-2" />
            ) : (
              <span className="text-gray-500">Drag & drop or click to select a main image</span>
            )}
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Gallery Images</label>
          <div {...getGalleryRootProps()} className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors duration-200 ${isGalleryDragActive ? "bg-green-50 border-green-500" : "bg-gray-50 border-gray-300"}`}>
            <input {...getGalleryInputProps()} name="galleryImages" />
            {galleryPreviews.length > 0 ? (
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {galleryPreviews.map((src, idx) => (
                  <img key={idx} src={src} alt={`Gallery ${idx}`} className="h-16 w-16 object-cover rounded shadow" />
                ))}
              </div>
            ) : (
              <span className="text-gray-500">Drag & drop or click to select gallery images</span>
            )}
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Map Location</label>
          <LeafletLocationPicker value={mapCoords} onChange={handleMapChange} />
          {mapCoords && (
            <div className="text-xs text-gray-500 mt-1">Selected: Lat {mapCoords.lat}, Lng {mapCoords.lng}</div>
          )}
        </div>
        {success && <div className="text-green-600 font-bold">{success}</div>}
        {error && <div className="text-red-600 font-bold">{error}</div>}
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold w-full" disabled={loading}>
          {loading ? (editProperty ? "Updating..." : "Posting...") : (editProperty ? "Update Property" : "Post Property")}
        </button>
      </form>
    </div>
  );
}