# Voucher Bank 

## Table of Contents
+ [About](#about)
+ [Demo](#demo)
+ [Getting Started](#getting_started)
+ [How It Works](#how_it_works)
+ [Built Using](#built_using)


## About <a name="about"></a>

VoucherBank is a full-stack MERN web application that simulates a customer loyalty platform where users can redeem accumulated reward points for digital vouchers.

The platform provides a seamless redemption experience, allowing users to discover and redeem rewards with ease, while administrators manage voucher offerings and gain insights into redemption activity through an integrated dashboard.


## Demo  <a name="demo"></a>

https://voucher-redemption.netlify.app

## Getting Started <a name="getting_started"></a>

### Prerequisites

- Node.js (https://nodejs.org)
- npm (comes with Node.js)
- MongoDB Atlas account (https://www.mongodb.com/atlas)
- Firebase project (https://console.firebase.google.com)


You can run the application using either a manual setup or Docker.


### Manual Setup

Clone the repository:

```bash
git clone https://github.com/isleepateleven/voucher-redemption-system.git
```

Install dependencies:

```bash
cd client
npm install

cd ../server
npm install
```

Set up environment variables:

server/.env
```env
MONGO_URI=...
GEMINI_API_KEY=...
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

client/.env
```env
REACT_APP_API_URL=http://localhost:5001/api
```

Run backend server:

```bash
cd server
npm start
```

Run frontend application:

```bash
cd client
npm start
```

Open the application in your browser and log in.


### Docker Setup

Alternatively, run the application using Docker:

```bash
docker-compose up --build
```

Frontend:  
http://localhost:3000  

Backend:  
http://localhost:5001  

To stop the containers:

```bash
docker-compose down
```


## How It Works <a name="how_it_works"></a>

**User**

- Sign in using email/password or Google authentication  
- Browse vouchers by category  
- Add vouchers to cart and redeem using points  
- Download redeemed vouchers as PDF files with QR codes
- Chat with the AI assistant for voucher-related queries
- Manage personal profile details  

**Administrator**

- Perform all user actions  
- Access the admin dashboard to:  
  - Create, edit, and delete vouchers  
  - Manage voucher limits and expiry dates
  - View registered users
  - Monitor redemption activity through analytics  


## Built Using <a name="built_using"></a>

Frontend: React, Tailwind CSS, PrimeReact  
Backend: Node.js, Express  
Database: MongoDB Atlas  
Authentication: Firebase Authentication  
Others: Gemini API, Netlify, Render  