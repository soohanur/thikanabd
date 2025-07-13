import property1 from '../assect/images/property/1.jpg'
import property2 from '../assect/images/property/2.jpg'
import property3 from '../assect/images/property/3.jpg'
import property4 from '../assect/images/property/4.jpg'
import property5 from '../assect/images/property/5.jpg'
import property6 from '../assect/images/property/6.jpg'
import property7 from '../assect/images/property/7.jpg'
import property8 from '../assect/images/property/8.jpg'
import property9 from '../assect/images/property/9.jpg'

import image1 from '../assect/images/property/single/1.jpg';
import image2 from '../assect/images/property/single/2.jpg';
import image3 from '../assect/images/property/single/3.jpg';
import image4 from '../assect/images/property/single/4.jpg';
import image5 from '../assect/images/property/single/5.jpg';


import client1 from '../assect/images/client/01.jpg'
import client2 from '../assect/images/client/02.jpg'
import client3 from '../assect/images/client/03.jpg'
import client4 from '../assect/images/client/04.jpg'
import client5 from '../assect/images/client/05.jpg'
import client6 from '../assect/images/client/06.jpg'
import client7 from '../assect/images/client/07.jpg'


export const propertyData = [
    {
        id: 1,
        title: "Affordable Apartment in Dhaka",
        image: property1,
        images: [image1, image2, image3, image4, image5],
        size: 1500,
        beds: 2,
        baths: 2,
        price: 25000,
        rating: 4.5,
        reviews: 20,
        location: "Dhaka",
        category: "Apartment",
        area: "Zero Point",
        type: "Rent",
        pType: ["Bachelor", "Family"],
        verified: true,
        description:
            "This affordable apartment in Dhaka offers a spacious 1500 sq.ft area with 2 bedrooms and 2 bathrooms. Perfect for families or professionals looking for a comfortable living space in the heart of the city.",
        map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848190847041!2d90.41251831543127!3d23.81033298456686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b8b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sDhaka!5e0!3m2!1sen!2sbd!4v1634567890123!5m2!1sen!2sbd",
    },
    {
        id: 2,
        title: "Sub-let in Rajshahi",
        image: property2,
        images: [image1, image2, image3, image4, image5],
        size: 1200,
        beds: 3,
        baths: 2,
        price: 2000,
        rating: 4.3,
        reviews: 15,
        location: "Rajshahi",
        category: "Sub-let",
        area: "Rani Bazar",
        type: "Rent",
        pType: ["Bachelor", "Family"],
        verified: false,
        description:
            "A cozy sub-let in Rajshahi located in the popular Rani Bazar area. This property features 3 bedrooms and 2 bathrooms, ideal for students or small families.",
        map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848190847041!2d90.41251831543127!3d23.81033298456686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b8b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sRajshahi!5e0!3m2!1sen!2sbd!4v1634567890123!5m2!1sen!2sbd",
    },
    {
        id: 3,
        title: "Modern Apartment in Dhaka",
        image: property3,
        images: [image1, image2, image3, image4, image5],
        size: 1400,
        beds: 3,
        baths: 2,
        price: 22000,
        rating: 4.7,
        reviews: 25,
        location: "Dhaka",
        category: "Apartment",
        area: "New Market",
        type: "Rent",
        pType: ["Family"],
        verified: true,
        description:
            "A modern apartment in Dhaka's New Market area. This property offers 3 bedrooms, 2 bathrooms, and a spacious living area, perfect for families or professionals.",
        map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848190847041!2d90.41251831543127!3d23.81033298456686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b8b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sDhaka!5e0!3m2!1sen!2sbd!4v1634567890123!5m2!1sen!2sbd",
    },
    {
        id: 4,
        title: "Office Space in Rajshahi",
        image: property4,
        images: [image1, image2, image3, image4, image5],
        size: 1100,
        beds: 2,
        baths: 2,
        price: 15000,
        rating: 4.2,
        reviews: 10,
        location: "Rajshahi",
        category: "Offices",
        area: "Railgate",
        type: "Rent",
        pType: ["Family", "Office"],
        verified: true,
        description:
            "A well-maintained office space in Rajshahi's Railgate area. This property is ideal for startups or small businesses looking for a professional workspace.",
        map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848190847041!2d90.41251831543127!3d23.81033298456686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b8b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sRajshahi!5e0!3m2!1sen!2sbd!4v1634567890123!5m2!1sen!2sbd",
    },{
        id: 5,
        title: "Luxury Apartment in Dhaka",
        image: property5,
        images: [image1, image2, image3, image4, image5],
        size: 1800,
        beds: 4,
        baths: 3,
        price: 45000,
        rating: 4.8,
        reviews: 30,
        location: "Dhaka",
        category: "Apartment",
        area: "Banani",
        type: "Rent",
        pType: ["Bachelor", "Family"],
        verified: true,
        description:
            "A luxurious 4-bedroom apartment in Dhaka's Banani area. Perfect for families seeking a premium living experience.",
        map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848190847041!2d90.41251831543127!3d23.81033298456686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b8b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sBanani!5e0!3m2!1sen!2sbd!4v1634567890123!5m2!1sen!2sbd",
    },
    {
        id: 6,
        title: "Cozy Studio in Rajshahi",
        image: property6,
        images: [image1, image2, image3, image4, image5],
        size: 600,
        beds: 1,
        baths: 1,
        price: 8000,
        rating: 4.1,
        reviews: 12,
        location: "Rajshahi",
        category: "Studio",
        area: "Kazla",
        type: "Rent",
        pType: ["Family"],
        verified: false,
        description:
            "A cozy studio apartment in Rajshahi's Kazla area. Ideal for students or single professionals.",
        map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848190847041!2d90.41251831543127!3d23.81033298456686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b8b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sKazla!5e0!3m2!1sen!2sbd!4v1634567890123!5m2!1sen!2sbd",
    },
    {
        id: 7,
        title: "Spacious Duplex in Dhaka",
        image: property7,
        images: [image1, image2, image3, image4, image5],
        size: 2500,
        beds: 5,
        baths: 4,
        price: 60000,
        rating: 4.9,
        reviews: 40,
        location: "Dhaka",
        category: "Duplex",
        area: "Gulshan",
        type: "Rent",
        pType: ["Bachelor", "Family"],
        verified: true,
        description:
            "A spacious 5-bedroom duplex in Dhaka's Gulshan area. Perfect for large families or corporate housing.",
        map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848190847041!2d90.41251831543127!3d23.81033298456686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b8b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sGulshan!5e0!3m2!1sen!2sbd!4v1634567890123!5m2!1sen!2sbd",
    },
    {
        id: 8,
        title: "Budget-Friendly Flat in Rajshahi",
        image: property8,
        images: [image1, image2, image3, image4, image5],
        size: 1000,
        beds: 2,
        baths: 2,
        price: 12000,
        rating: 4.0,
        reviews: 18,
        location: "Rajshahi",
        category: "Flat",
        area: "Shah Makhdum",
        type: "Rent",
        pType: ["Family"],
        verified: false,
        description:
            "A budget-friendly 2-bedroom flat in Rajshahi's Shah Makhdum area. Suitable for small families or couples.",
        map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848190847041!2d90.41251831543127!3d23.81033298456686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b8b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sShah%20Makhdum!5e0!3m2!1sen!2sbd!4v1634567890123!5m2!1sen!2sbd",
    },
    {
        id: 9,
        title: "Commercial Space in Dhaka",
        image: property9,
        images: [image1, image2, image3, image4, image5],
        size: 2000,
        beds: 0,
        baths: 2,
        price: 50000,
        rating: 4.6,
        reviews: 22,
        location: "Dhaka",
        category: "Commercial",
        area: "Motijheel",
        type: "Rent",
        pType: ["Office"],
        verified: true,
        description:
            "A prime commercial space in Dhaka's Motijheel area. Ideal for offices or retail businesses.",
        map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848190847041!2d90.41251831543127!3d23.81033298456686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b8b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sMotijheel!5e0!3m2!1sen!2sbd!4v1634567890123!5m2!1sen!2sbd",
    },
];


export const brokerData = [
    {
        id: 0,
        image: client1,
        name: 'Abdul Rahman',
        location: 'Dhaka',
        email: 'abdul.rahman@example.com',
        phone: '+880123456789',
        description: 'Experienced broker specializing in luxury apartments in Dhaka.',
        reviews: [
            { reviewer: 'Hasan Ahmed', comment: 'Very professional and helpful.', rating: 5 },
            { reviewer: 'Mizanur Rahman', comment: 'Great experience working with him.', rating: 4.5 }
        ],
        listedProperties: [
            {
                id: 1,
                title: "Affordable Apartment in Dhaka",
                image: property1,
                images: [image1, image2, image3, image4, image5],
                size: 1500,
                beds: 2,
                baths: 2,
                price: 25000,
                rating: 4.5,
                reviews: 20,
                location: "Dhaka",
                category: "Apartment",
                area: "Zero Point",
                type: "Rent",
                verified: true,
                description:
                    "This affordable apartment in Dhaka offers a spacious 1500 sq.ft area with 2 bedrooms and 2 bathrooms. Perfect for families or professionals looking for a comfortable living space in the heart of the city.",
                map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848190847041!2d90.41251831543127!3d23.81033298456686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b8b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sDhaka!5e0!3m2!1sen!2sbd!4v1634567890123!5m2!1sen!2sbd",
            },
            {
                id: 2,
                title: "Luxury Apartment in Banani",
                image: property5,
                images: [image1, image2, image3, image4, image5],
                size: 1800,
                beds: 4,
                baths: 3,
                price: 45000,
                rating: 4.8,
                reviews: 30,
                location: "Dhaka",
                category: "Apartment",
                area: "Banani",
                type: "Rent",
                verified: true,
                description:
                    "A luxurious 4-bedroom apartment in Dhaka's Banani area. Perfect for families seeking a premium living experience.",
                map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848190847041!2d90.41251831543127!3d23.81033298456686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b8b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sBanani!5e0!3m2!1sen!2sbd!4v1634567890123!5m2!1sen!2sbd",
            }
        ]
    },
    {
        id: 1,
        image: client2,
        name: 'Fahim Islam',
        location: 'Chattogram',
        email: 'fahim.islam@example.com',
        phone: '+880987654321',
        description: 'Expert in commercial properties in Chattogram.',
        reviews: [
            { reviewer: 'Rafiq Uddin', comment: 'Highly knowledgeable about the market.', rating: 4.8 },
            { reviewer: 'Sajid Karim', comment: 'Quick and efficient service.', rating: 4.7 }
        ],
        listedProperties: [
            {
                id: 3,
                title: "Commercial Space in Agrabad",
                image: property4,
                images: [image1, image2, image3, image4, image5],
                size: 2000,
                beds: 0,
                baths: 2,
                price: 50000,
                rating: 4.6,
                reviews: 22,
                location: "Chattogram",
                category: "Commercial",
                area: "Agrabad",
                type: "Rent",
                verified: true,
                description:
                    "A prime commercial space in Chattogram's Agrabad area. Ideal for offices or retail businesses.",
                map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848190847041!2d90.41251831543127!3d23.81033298456686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b8b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sAgrabad!5e0!3m2!1sen!2sbd!4v1634567890123!5m2!1sen!2sbd",
            },
            {
                id: 4,
                title: "Office Space in Khulshi",
                image: property6,
                images: [image1, image2, image3, image4, image5],
                size: 1500,
                beds: 0,
                baths: 2,
                price: 40000,
                rating: 4.4,
                reviews: 18,
                location: "Chattogram",
                category: "Office",
                area: "Khulshi",
                type: "Rent",
                verified: true,
                description:
                    "A well-maintained office space in Chattogram's Khulshi area. Perfect for startups or small businesses.",
                map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848190847041!2d90.41251831543127!3d23.81033298456686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b8b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sKhulshi!5e0!3m2!1sen!2sbd!4v1634567890123!5m2!1sen!2sbd",
            }
        ]
    },
    {
        id: 2,
        image: client3,
        name: 'Nusrat Jahan',
        location: 'Sylhet',
        email: 'nusrat.jahan@example.com',
        phone: '+8801122334455',
        description: 'Specialist in residential properties in Sylhet.',
        reviews: [
            { reviewer: 'Ayesha Khan', comment: 'Very friendly and professional.', rating: 4.9 },
            { reviewer: 'Tanvir Alam', comment: 'Helped me find the perfect home.', rating: 4.8 }
        ],
        listedProperties: [
            {
                id: 5,
                title: "Cozy Apartment in Sylhet",
                image: property7,
                images: [image1, image2, image3, image4, image5],
                size: 1200,
                beds: 3,
                baths: 2,
                price: 18000,
                rating: 4.7,
                reviews: 15,
                location: "Sylhet",
                category: "Apartment",
                area: "Zindabazar",
                type: "Rent",
                verified: true,
                description:
                    "A cozy 3-bedroom apartment in Sylhet's Zindabazar area. Ideal for families or professionals.",
                map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848190847041!2d90.41251831543127!3d23.81033298456686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b8b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sSylhet!5e0!3m2!1sen!2sbd!4v1634567890123!5m2!1sen!2sbd",
            }
        ]
    },
    {
        id: 3,
        image: client4,
        name: 'Shahidul Islam',
        location: 'Khulna',
        email: 'shahidul.islam@example.com',
        phone: '+8809988776655',
        description: 'Expert in commercial and industrial properties in Khulna.',
        reviews: [
            { reviewer: 'Faruk Hossain', comment: 'Very knowledgeable and reliable.', rating: 4.6 },
            { reviewer: 'Jahid Hasan', comment: 'Great service and support.', rating: 4.5 }
        ],
        listedProperties: [
            {
                id: 6,
                title: "Industrial Warehouse in Khulna",
                image: property8,
                images: [image1, image2, image3, image4, image5],
                size: 5000,
                beds: 0,
                baths: 1,
                price: 75000,
                rating: 4.8,
                reviews: 10,
                location: "Khulna",
                category: "Industrial",
                area: "Boyra",
                type: "Rent",
                verified: true,
                description:
                    "A spacious industrial warehouse in Khulna's Boyra area. Perfect for storage or manufacturing.",
                map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848190847041!2d90.41251831543127!3d23.81033298456686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b8b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sKhulna!5e0!3m2!1sen!2sbd!4v1634567890123!5m2!1sen!2sbd",
            }
        ]
    }
];

export const userData = {
    id: 1,
    name: "Habib Rahman",
    email: "habib@google.com",
    phone: "+880 123-456-7890",
    address: "123 Main Street, Rajshahi, Bangladesh",
    profilePic: client4,
};

export const propertiesData = [
    {
        id: 1,
        title: "Affordable Apartment in Dhaka",
        image: property1,
        images: [image1, image2, image3, image4, image5],
        size: 1500,
        beds: 2,
        baths: 2,
        price: 25000,
        rating: 4.5,
        reviews: 20,
        location: "Dhaka",
        category: "Apartment",
        area: "Zero Point",
        type: "Rent",
        pType: ["Family"],
        verified: true,
        description:
            "This affordable apartment in Dhaka offers a spacious 1500 sq.ft area with 2 bedrooms and 2 bathrooms. Perfect for families or professionals looking for a comfortable living space in the heart of the city.",
        map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848190847041!2d90.41251831543127!3d23.81033298456686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b8b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sDhaka!5e0!3m2!1sen!2sbd!4v1634567890123!5m2!1sen!2sbd",
    },
    {
        id: 2,
        title: "Sub-let in Rajshahi",
        image: property2,
        images: [image1, image2, image3, image4, image5],
        size: 1200,
        beds: 3,
        baths: 2,
        price: 2000,
        rating: 4.3,
        reviews: 15,
        location: "Rajshahi",
        category: "Sub-let",
        area: "Rani Bazar",
        type: "Rent",
        pType: ["Family"],
        verified: false,
        description:
            "A cozy sub-let in Rajshahi located in the popular Rani Bazar area. This property features 3 bedrooms and 2 bathrooms, ideal for students or small families.",
        map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848190847041!2d90.41251831543127!3d23.81033298456686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b8b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sRajshahi!5e0!3m2!1sen!2sbd!4v1634567890123!5m2!1sen!2sbd",
    },
    {
        id: 3,
        title: "Modern Apartment in Dhaka",
        image: property3,
        images: [image1, image2, image3, image4, image5],
        size: 1400,
        beds: 3,
        baths: 2,
        price: 22000,
        rating: 4.7,
        reviews: 25,
        location: "Dhaka",
        category: "Apartment",
        area: "New Market",
        type: "Rent",
        pType: ["Family"],
        verified: true,
        description:
            "A modern apartment in Dhaka's New Market area. This property offers 3 bedrooms, 2 bathrooms, and a spacious living area, perfect for families or professionals.",
        map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848190847041!2d90.41251831543127!3d23.81033298456686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b8b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sDhaka!5e0!3m2!1sen!2sbd!4v1634567890123!5m2!1sen!2sbd",
    },
    {
        id: 4,
        title: "Office Space in Rajshahi",
        image: property4,
        images: [image1, image2, image3, image4, image5],
        size: 1100,
        beds: 2,
        baths: 2,
        price: 15000,
        rating: 4.2,
        reviews: 10,
        location: "Rajshahi",
        category: "Offices",
        area: "Railgate",
        type: "Rent",
        pType: ["Bachelor"],
        verified: true,
        description:
            "A well-maintained office space in Rajshahi's Railgate area. This property is ideal for startups or small businesses looking for a professional workspace.",
        map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848190847041!2d90.41251831543127!3d23.81033298456686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7b8b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sRajshahi!5e0!3m2!1sen!2sbd!4v1634567890123!5m2!1sen!2sbd",
    },
];
