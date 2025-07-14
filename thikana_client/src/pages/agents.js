import React, { useState } from "react";
import { Link } from "react-router-dom";
import Broker from "../components/broker";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { apiUrl } from "../utils/api";

import { userData, propertiesData } from "../data/data";

export default function Profiles() {

    return (
        <>
            <Navbar navClass="defaultscroll sticky" menuClass = "navigation-menu nav-left" />
            <div className="container " style={{ marginBottom: "50px", marginTop: "150px" }}>
                <Broker />
            </div>
            <Footer />
        </>
    );
}