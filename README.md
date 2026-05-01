# Thikana BD — Real Estate Platform

**Thikana** (ঠিকানা) means *address* in Bengali. A full-stack real estate marketplace for Bangladesh — buy, rent, list properties, and connect with agents.

## Features

- **Property Listings** — Browse, filter, and search properties for sale or rent
- **Agent Marketplace** — Find verified agents or apply to become one
- **Booking System** — Book property viewings and track current/past bookings
- **Wallet** — In-app wallet for managing payments and deposits
- **Wishlist** — Save and track favourite properties
- **Location Picker** — Interactive map integration with Leaflet.js
- **Payment Gateway** — Full payment flow with success/fail/cancel handling
- **User Dashboard** — Manage bookings, listings, profile, and wallet in one place

## Tech Stack

**Frontend** (`thikana_client`)

![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

- React.js SPA
- Tailwind CSS + Material Design Icons
- Leaflet.js for map/location picking
- React Router for navigation

**Backend** (`thikana_server`)

- Node.js / Express REST API
- MongoDB database
- JWT authentication
- Payment gateway integration

## Project Structure

```
├── thikana_client/          # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level pages
│   │   └── data/            # Static data
│   └── public/
└── thikana_server/          # Node.js backend
    ├── models/
    ├── routes/
    └── middleware/
```

## Getting Started

**Frontend**
```bash
cd thikana_client
npm install
npm start
```

**Backend**
```bash
cd thikana_server
npm install
# Add your .env (DB connection, JWT secret, payment keys)
npm start
```

## Built By

[Md. Sohanur Rahman](https://github.com/soohanur) — Co-Founder @ [Onspace](https://github.com/onspace)
