import React from "react";

import { brokerData } from '../data/data';
import { Link, useNavigate } from "react-router-dom";

import { FiFacebook, FiInstagram, FiTwitter } from '../assect/icons/vander';

export default function Broker() {
    const navigate = useNavigate();

    return (
        <>
        <div className="row justify-content-center">
            <div className="col">
                <div className="section-title text-center mb-4 pb-2">
                    <h4 className="title mb-3">Agents</h4>
                    <p className="text-muted para-desc mb-0 mx-auto">Connect with experienced agents to buy, sell, or rent properties effortlessly. Enjoy a seamless experience with no hidden fees</p>
                </div>
            </div>
        </div>

        <div className="row g-4 mt-0">
            {brokerData.map((item, index) => {
                return (
                    <div className="col-lg-3 col-md-4 col-12" key={index}>
                        <div className="card team team-primary text-center" onClick={() => navigate(`/agent-detail/${index}`)}>
                            <div className="card-img team-image d-inline-block mx-auto rounded-pill avatar avatar-ex-large overflow-hidden">
                                <img src={item.image} className="img-fluid" alt="" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                                <div className="card-overlay avatar avatar-ex-large rounded-pill"></div>
                            </div>

                            <div className="content mt-3">
                                <span className="text-dark h5 mb-0 title " style={{ cursor: "pointer"}}>{item.name}</span>
                                <h6 className="text-muted mb-0 fw-normal">{item.location}</h6>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
        </>
    );
}