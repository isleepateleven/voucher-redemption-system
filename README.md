# VoucherBank

## Table of Contents
+ [Project Summary](#project-summary)
+ [Demo](#demo)
+ [Features](#features)
+ [Tech Stack](#tech-stack)
+ [Running the Project](#running-the-project)
+ [Running with Docker](#running-with-docker)


## Project Summary

VoucherBank is a full-stack MERN web application that simulates a customer loyalty and rewards platform. It provides a point-based voucher redemption system where users can browse and redeem vouchers, manage their accounts, and access redeemed rewards, alongside an administration portal for managing vouchers, users, and redemption activities.

The application also features a Retrieval-Augmented Generation (RAG) powered AI assistant that answers VoucherBank-related questions using information retrieved from a PDF knowledge base. The assistant uses hybrid retrieval, combining semantic vector search and BM25 keyword search to retrieve relevant context before generating grounded responses with Gemini.


## Demo

https://voucher-redemption.netlify.app


## Features

### User

- Sign in using email/password or Google authentication
- Browse vouchers by category
- Add vouchers to cart and redeem using reward points
- View redeemed voucher history
- Download redeemed vouchers as PDF files with QR codes
- Manage personal profile details
- Ask the AI assistant questions about VoucherBank

### Administrator

- Perform all user actions
- Create, edit, and delete vouchers
- Configure voucher redemption limits and expiry dates
- View registered users
- Monitor redemption activity through analytics

### AI Assistant

- Answer VoucherBank-related questions using Retrieval-Augmented Generation (RAG)
- Retrieve relevant information from a PDF knowledge base using hybrid semantic and BM25 keyword search
- Generate vector embeddings for semantic retrieval and store them in LanceDB
- Generate context-grounded responses using retrieved knowledge and Gemini
- Automatically process and index knowledge documents when the backend starts
- Detect knowledge base changes and rebuild the vector index only when required


## Tech Stack

**Frontend:** React, Tailwind CSS, PrimeReact  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (MongoDB Atlas)  
**Authentication:** Firebase Authentication  
**AI / RAG:** Google Gemini API, LanceDB, BM25, Hybrid Retrieval  
**Containerization:** Docker, Docker Compose  
**Deployment:** Netlify, Render  


## Running the Project

### Prerequisites

- Node.js
- npm
- MongoDB Atlas account
- Firebase project
- Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/isleepateleven/voucher-redemption-system.git
cd voucher-redemption-system
```

### 2. Install dependencies

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

### 3. Configure environment variables

Create `server/.env`:

```env
MONGO_URI=...
GEMINI_API_KEY=...
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

Create `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5001/api
```

### 4. Start the backend

```bash
cd server
npm start
```

The VoucherBank knowledge base is automatically processed and indexed when the backend starts. If the source documents have not changed, the existing vector index is reused.

### 5. Start the frontend

In a separate terminal:

```bash
cd client
npm start
```

The application will be available at:

```text
http://localhost:3000
```


## Running with Docker

Make sure Docker is installed and running.

From the project root:

```bash
docker-compose up --build
```

The services will be available at:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:5001
```

To stop the containers:

```bash
docker-compose down
```