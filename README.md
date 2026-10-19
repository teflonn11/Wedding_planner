# Wedding Planner Service

## Overview

The Wedding Planner Service is an Express-based server application designed to manage and streamline wedding planning operations, including guest management, budget tracking, vendor coordination, and schedule handling. It connects to a MySQL database and includes Postman test collections for API validation.

## Prerequisites

Before running the project, ensure you have the following installed:

1. Node.js (version 20.18.0 or later)
2. npm (version 10.8.2 or later)
3. MySQL (version 9.2.0 or later)
4. Postman, if you want to run the API tests

Before starting the application, execute the `sql-queries.sql` script to set up the database.

The Postman collections and environments are available in the `postman` directory.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/teflonn11/Wedding_planner.git
cd Wedding_planner
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

Open a separate terminal from the project root directory and run:

```bash
cd frontend
npm install --legacy-peer-deps
```

## Configuration

Create a `.env` file in the appropriate location for your backend configuration. Add the following environment variables and replace the placeholder values with your own settings.

### Backend Environment Variables

```env
PORT=4000
DB_HOST=<DB_HOST>
DB_USER=<DB_USER>
DB_PASSWORD=<DB_PASSWORD>
DB_NAME=<DB_NAME>
JWT_SECRET=<JWT_SECRET>
JWT_EXPIRES_IN=<JWT_EXPIRES_IN>
SMTP_EMAIL=<SMTP_EMAIL>
SMTP_PASS=<SMTP_EMAIL_API_PASSWORD>
SMTP_FROM=<EMAIL_FROM>
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend Environment Variables

Configure the frontend environment using a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**Important:** Do not commit your actual `.env` or `.env.local` files to GitHub. Keep passwords, email credentials, and JWT secrets private.

## Database Setup

1. Ensure your MySQL server is running.
2. Create or configure the database using the appropriate settings.
3. Execute the `sql-queries.sql` script to create the required database tables and schema.

Ensure that the database credentials in your backend environment file match your MySQL configuration.

## Running the Application

### Development Mode

#### Start the backend

Open a terminal and navigate to the backend directory:

```bash
cd backend
npm run dev
```

The backend server should run on the port configured in your environment variables, which defaults to port `4000`.

#### Start the frontend

Open a separate terminal and navigate to the frontend directory:

```bash
cd frontend
npm run dev
```

The frontend development server should be available at:

```text
http://localhost:3000
```

### Production Mode

#### Start the backend

From the backend directory, run:

```bash
npm start
```

This starts the application using the command configured by the backend's `start` script, which in your original documentation runs `src/server.js`.

#### Build and start the frontend

From the frontend directory, run:

```bash
npm run build
npm start
```

The frontend production server will use the port configured by the application, typically `3000`.

## API Testing

The project includes Postman collections and environment files in the `postman` directory.

To test the API:

1. Open Postman.
2. Import the available collection and environment files.
3. Configure the environment variables required by the API.
4. Start the backend server.
5. Run the requests in the collection and review the responses.

## Troubleshooting

- **Database connection errors:** Check that MySQL is running and that your database credentials are correct.
- **Missing dependencies:** Run `npm install` in the relevant backend or frontend directory.
- **Environment variable errors:** Ensure the required `.env` and `.env.local` files exist and contain valid configuration values.
- **Port conflicts:** Ensure ports `4000` and `3000` are available, or update your configuration accordingly.
- **API requests failing:** Verify that the backend is running and that `NEXT_PUBLIC_API_URL` points to the correct API endpoint.

## Security

- Never commit passwords, API keys, email credentials, or JWT secrets to the repository.
- Use environment variables to manage sensitive configuration.
- Keep dependencies updated and review security advisories regularly.

## License

Add the appropriate license information here if the project is distributed under an open-source license.