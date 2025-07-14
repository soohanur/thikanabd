import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import background from '../../assect/images/bg/hero.png'
import Navbar from "../../components/navbar";
import Categories from "../../components/categories"
import FeaturedProperties from "../../components/featuredProperties"
import Broker from "../../components/broker";
import FooterTopImage from "../../components/FoterTopImage";
import Footer from "../../components/footer";
import { TypeAnimation } from 'react-type-animation';
import Select from 'react-select'
import axios from "axios";
import defaultProfile from '../../assect/images/profile-thumb.png';

export default function Index(){

    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [areaOptions, setAreaOptions] = useState([]);
    const [selectedArea, setSelectedArea] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [usersError, setUsersError] = useState("");

    const navigate = useNavigate();

    const handleFind = (e) => {
        e.preventDefault();
        const filters = {
            location: selectedLocation?.value || "",
            area: selectedArea?.value || "",
            category: selectedCategory?.value || "",
            propertyType: selectedType?.value || "", // <-- changed from type to propertyType
        };
        navigate("/grid-sidebar", { state: filters });
    };

    // Updated options with value===label
    const categories = [
        { value: 'Houses', label: 'Houses' },
        { value: 'Apartment', label: 'Apartment' },
        { value: 'Offices', label: 'Offices' },
        { value: 'Sub-let', label: 'Sub-let' },
    ];
    const categories2 = [
        { value: 'Land', label: 'Land' },
        { value: 'Houses', label: 'Houses' },
        { value: 'Apartments', label: 'Apartments' }
    ];
    const location = [
        { value: 'Dhaka', label: 'Dhaka' },
        { value: 'Rajshahi', label: 'Rajshahi' },
    ];
    const areasByLocation = {
        'Dhaka': [
            { value: 'Gazipur', label: 'Gazipur' },
            { value: 'Gulshan', label: 'Gulshan' },
            { value: 'Badda', label: 'Badda' },
            { value: 'Abdullahpur', label: 'Abdullahpur' },
            { value: 'Farmgate', label: 'Farmgate' },
            { value: 'Mirpur 1', label: 'Mirpur 1' },
            { value: 'Mirpur 2', label: 'Mirpur 2' },
            { value: 'Mirpur 10', label: 'Mirpur 10' },
        ],
        'Rajshahi': [
            { value: 'Zero Point', label: 'Zero Point' },
            { value: 'Rani Bazar', label: 'Rani Bazar' },
            { value: 'New Market', label: 'New Market' },
            { value: 'Railgate', label: 'Railgate' },
            { value: 'Alupotti', label: 'Alupotti' },
            { value: 'Talaimari', label: 'Talaimari' },
            { value: 'Kajla', label: 'Kajla' },
            { value: 'Binodpur', label: 'Binodpur' },
            { value: 'Khorkhori', label: 'Khorkhori' },
        ]
    };
    const handleLocationChange = (selectedOption) => {
        setSelectedLocation(selectedOption);
        setAreaOptions(areasByLocation[selectedOption.value] || []);
        setSelectedArea(null);
    };
    const Status = [
        { value: 'New', label: 'New' },
        { value: 'Used', label: 'Used' },
        { value: 'Renovated', label: 'Renovated' },
    ];
    const Type = [
        { value: 'Family', label: 'Family' },
        { value: 'Bachelor', label: 'Bachelor' },
        { value: 'Office', label: 'Office' },
    ];

    React.useEffect(() => {
        async function fetchUsers() {
            try {
                setUsersLoading(true);
                setUsersError("");
                const res = await axios.get("http://localhost:5000/api/users");
                setUsers(res.data.users || []);
            } catch (err) {
                setUsersError("Failed to load users");
            } finally {
                setUsersLoading(false);
            }
        }
        fetchUsers();
    }, []);

    return(
        <>
        <Navbar navClass="defaultscroll sticky" menuClass = "navigation-menu nav-left"/>
        <section className="position-relative mt-5 pt-4">
            <div className="container-fluid px-md-4 px-2 mt-2">
                <div className="bg-home-one d-table w-100 shadow rounded-3 overflow-hidden" id="home">
                    <div className="bg-overlay image-wrap" id="hero-images" style={{backgroundImage:`url(${background})`}}></div>
                    <div className="bg-overlay bg-black opacity-50"></div>

                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-12">
                                <div className="title-heading">
                                    <h4 className="heading fw-bold text-white title-dark mb-3">We will help you find <br/> your
                                    <TypeAnimation
                                        sequence={[
                                            'Wonderful',
                                            2000, 
                                            'Dream',
                                            2000,
                                        ]}
                                        wrapper="span"
                                        speed={20}
                                        repeat={Infinity}
                                        className="typewrite text-green-500 ms-2"
                                        cursor={false}
                                    /> home</h4>
                                    <p className="para-desc text-white title-dark mb-0">One-Stop Digital Solution for Renting, Buying, and Selling properties in Bangladesh.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className="section pt-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 mt-sm-0 pt-sm-0">
                        <div className="features-absolute">
                            <ul className="nav nav-pills bg-white shadow border-bottom p-3 flex-row d-md-inline-flex nav-justified mb-0 rounded-top-3 position-relative overflow-hidden" id="pills-tab" role="tablist">
                                <li className="nav-item m-1">
                                    <Link className={`${activeIndex === 0 ? 'active' : '' } nav-link py-2 px-4  rounded-3 fw-medium`} to="#" onClick={()=>setActiveIndex(0)} >
                                    Rent
                                    </Link>
                                </li>

                                <li className="nav-item m-1">
                                    <Link className={`${activeIndex === 1 ? 'active' : '' } nav-link py-2 px-4  rounded-3 fw-medium`} to="#" onClick={()=>setActiveIndex(1)}>
                                        Buy
                                    </Link>
                                </li>
                            </ul>
                            
                            <div className="tab-content bg-white rounded-bottom-3 rounded-end-3 sm-rounded-0 shadow">
                                {activeIndex === 0 ? 
                                    <div className="card border-0 active">
                                        <form className="card-body text-start">
                                            <div className="registration-form text-dark text-start">
                                                <div className="row g-lg-0">

                                                    <div className="col-lg-3 col-md-6 col-12">
                                                        <div className="mb-3">
                                                            <label className="form-label fs-6">Location :</label>
                                                            <div className="filter-search-form position-relative filter-border bg-light">
                                                                <i className="fa-solid fa-location-dot fea icon-ex-md icons"></i>
                                                                <Select 
                                                                    className="form-input filter-input-box bg-gray-50  border-0" 
                                                                    options={location} 
                                                                    onChange={handleLocationChange} 
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-3 col-md-6 col-12">
                                                        <div className="mb-3">
                                                            <label className="form-label fs-6">Area :</label>
                                                            <div className="filter-search-form position-relative filter-border bg-light">
                                                            <i className="fa-solid fa-map-signs fea icon-ex-md icons"></i>
                                                                <Select 
                                                                    className="form-input filter-input-box bg-gray-50 border-0" 
                                                                    options={areaOptions} 
                                                                    onChange={setSelectedArea}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-3 col-md-6 col-12">
                                                        <div className="mb-3">
                                                            <label className="form-label fs-6">Category :</label>
                                                            <div className="filter-search-form position-relative filter-border bg-light">
                                                            <i className="fa-solid fa-building fea icon-ex-md icons"></i>
                                                                <Select 
                                                                    className="form-input filter-input-box bg-gray-50  border-0" 
                                                                    options={categories} 
                                                                    onChange={setSelectedCategory}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-3 col-md-6 col-12">
                                                        <div className="mb-3">
                                                            <label className="form-label fs-6">Property Type :</label>
                                                            <div className="filter-search-form position-relative filter-border bg-light">
                                                            <i className="fa-solid fa-users fea icon-ex-md icons"></i>
                                                                <Select 
                                                                    className="form-input filter-input-box bg-gray-50  border-0" 
                                                                    options={Type} 
                                                                    onChange={setSelectedType}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
            
                                                    <div className="col-lg-3 col-md-6 col-12">
                                                        <input type="submit" id="search" name="search" style={{height: '48px'}} className="btn btn-primary searchbtn w-100" value="Find Rent Property" onClick={handleFind}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>:''
                                }
                                 
                                 {activeIndex === 1 ? 
                                    <div className="card border-0 active">
                                        <form className="card-body text-start">
                                            <div className="registration-form text-dark text-start">
                                                <div className="row g-lg-0">
                                                     <div className="col-lg-3 col-md-6 col-12">
                                                        <div className="mb-3">
                                                            <label className="form-label fs-6">Location :</label>
                                                            <div className="filter-search-form position-relative filter-border bg-light">
                                                                <i className="fa-solid fa-location-dot fea icon-ex-md icons"></i>
                                                                <Select 
                                                                    className="form-input filter-input-box bg-gray-50  border-0" 
                                                                    options={location} 
                                                                    onChange={handleLocationChange} 
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-3 col-md-6 col-12">
                                                        <div className="mb-3">
                                                            <label className="form-label fs-6">Area :</label>
                                                            <div className="filter-search-form position-relative filter-border bg-light">
                                                            <i className="fa-solid fa-map-signs fea icon-ex-md icons"></i>
                                                                <Select 
                                                                    className="form-input filter-input-box bg-gray-50  border-0" 
                                                                    options={areaOptions} 
                                                                    onChange={setSelectedArea}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="col-lg-3 col-md-6 col-12">
                                                        <div className="mb-3">
                                                            <label className="form-label fs-6">Property Category :</label>
                                                            <div className="filter-search-form position-relative filter-border bg-light">
                                                            <i className="fa-solid fa-building fea icon-ex-md icons"></i>
                                                                <Select 
                                                                    className="form-input filter-input-box bg-gray-50  border-0" 
                                                                    options={categories2} 
                                                                    onChange={setSelectedCategory}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="col-lg-3 col-md-6 col-12">
                                                        <div className="mb-3">
                                                            <label className="form-label fs-6">Status :</label>
                                                            <div className="filter-search-form position-relative filter-border bg-light">
                                                            <i className="fa-solid fa-tag fea icon-ex-md icons"></i>
                                                                <Select 
                                                                    className="form-input filter-input-box bg-gray-50 border-0" 
                                                                    options={Status} 
                                                                    onChange={setSelectedType}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
            
                                                    <div className="col-lg-3 col-md-6 col-12">
                                                        <input type="submit" id="search" name="Find" style={{height: '48px'}} className="btn btn-primary searchbtn w-100" value="Find Selling Property" onClick={handleFind}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>:''
                                }
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>

            <div className="container mt-100 mt-60">
                <Categories/>
            </div>

            <div className="container mt-100 mt-60">
                <FeaturedProperties/>
            </div>

            <div className="container mt-100 mt-60">
                <Broker/>
            </div>

            <div className="container mt-5 mb-5">
                <h3 className="mb-4 font-bold text-lg">Meet Our Users</h3>
                {usersLoading && <div>Loading users...</div>}
                {usersError && <div className="text-red-500">{usersError}</div>}
                <div className="flex overflow-x-auto gap-6 pb-2">
                    {users.map(user => (
                        <Link key={user._id || user.username} to={`/public-profile/${user.username || user._id}`} className="flex flex-col items-center min-w-[100px]">
                            <img
                                src={user.profilePicture ? (user.profilePicture.startsWith('http') ? user.profilePicture : `http://localhost:5000${user.profilePicture}`) : defaultProfile}
                                alt={user.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-green-500 shadow mb-2"
                            />
                            <span className="text-sm font-semibold text-gray-700 text-center">{user.name || user.username}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
        <FooterTopImage/>
        <Footer/>
        </>
    )
}