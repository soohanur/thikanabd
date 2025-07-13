import React from "react";
import { Link } from "react-router-dom";

import category1 from '../assect/images/property/residential.jpg'
import category2 from '../assect/images/property/land.jpg'
import category3 from '../assect/images/property/commercial.jpg'
import category4 from '../assect/images/property/industrial.jpg'
import category5 from '../assect/images/property/investment.jpg'

export default function Categories(){

    const data = [
        {
            image:category1,
            name:'Apartment/Flats',
            listings:'346 Listings'
        },
        {
            image:category2,
            name:'Land',
            listings:'124 Listings'
        },
        {
            image:category3,
            name:'Duplex Home',
            listings:'265 Listings'
        },
        {
            image:category4,
            name:'Sublet/Roommate',
            listings:'452 Listings'
        },
        {
            image:category5,
            name:'Office Space',
            listings:'12 Listings'
        },
    ]
    return(
        <>
        <div className="row justify-content-center">
            <div className="col">
                <div className="section-title text-center mb-2 pb-2">
                    <h4 className="title mb-3">Property Categories</h4>
                    <p className="text-muted para-desc mb-0 mx-auto">
                        Explore a wide range of property categories to find your perfect match
</p>
                </div>
            </div>
        </div>

        <div className="row row-cols-lg-5 row-cols-md-3 row-cols-sm-2 row-cols-1 g-4 mt-0">
            {data.map((item, index) => {
                return(
                    <div className="col" key={index}>
                        <div className="categories position-relative overflow-hidden rounded-3 shadow">
                            <div className="d-flex align-items-center justify-content-center" style={{ height: '150px', width: '100%' }}>
                                <img src={item.image} className="img-fluid w-100 h-100" style={{ objectFit: 'cover' }} alt=""/>
                            </div>
                            <div className="p-3">
                                <Link to="" className="title text-dark fs-5 fw-medium">{item.name}</Link>
                                <p className="text-muted small mb-0">{item.listings}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
        </>
    )
}