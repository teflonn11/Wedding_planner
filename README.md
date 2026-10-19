# Wedding Planner Service

## Overview

The Automated Wedding System is an Express-based server application designed to manage and streamline wedding planning operations, including guest management, budget tracking, vendor coordination, and schedule handling. It connects to a MySQL backend and includes Postman test suites for streamlined API validation.

## Setup Instructions

# Prerequisites

1. Node.js (version 20.18.0 or later)
2. npm (version 10.8.2 or later)
3. mysql (version 9.2.0 or later)
4. Before running the project please execute **sql-queries.sql**
5. Postman collection and environments are share in **postman directory**

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)

## Installation

1. Clone the repository:

   ```sh
         git clone https://campus.cs.le.ac.uk/gitlab/ug_project/24-25/aa1375.git
   ```

2. Install dependencies:
   
      ***Backend***

      ```sh
         cd backend
         npm install
      ```
   
   
      ***Frontend***
   
      ```sh
         cd frontend
         npm install --legacy-peer-deps
      ```

## Configuration

1. Create a .env file in the root directory and add the following environment variables:
      
      ***Backend***
      
      ```sh
         PORT = 4000
         DB_HOST=<DB_HOST>
         DB_USER=<DB_USER>
         DB_PASSWORD=<DB_PASSWORD>
         DB_NAME=<DB_NAME>
         JWT_SECRET=<JWT_SECRET>
         JWT_EXPIRES_IN=<JWT_EXPIRES_IN>
         SMTP_EMAIL=<SMTP_EMAIL>
         SMTP_PASS=<SMTP_EMAIL_API_PASSWORD>
         SMTP_FROM=<EMAIL_FROM>

         FRONTEND_URL = http://localhost:3000
         NODE_ENV = development
      ```
      
      ***Frontend***
      
      ```sh
         NEXT_PUBLIC_API_URL=http://localhost:4000/api
      ```
      

## Running the Application
### Development Mode
1. Start the server
   
      ***Backend***

      ```sh
         npm run dev
      ```
   
      ***Frontend***

      ```sh
         npm run dev
      ```

### Production Mode
1. Start the server:

   ```sh
         npm start
   ```

this runs the command `src/server.js `
