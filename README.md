# RESTFUL-API >> User Management Documentation

## Overview
This API provides functionality for managing users in a system, including user creation, updating, authentication, following/unfollowing, and searching nearby users. The system supports two authentication methods: local sign-in and Google sign-in.

## System Design

### Architecture
- **Backend Framework:** The API is designed using a Node.js backend with Express for routing.
- **Database:** MongoDB Atlas is used to store user data, including user credentials, follow relationships, and metadata.
- **Authentication:** JWT (JSON Web Token) is used for token-based authentication.

### Core Features
- **User Management:** Create, update, delete, and retrieve user details.
- **Authentication:** Local and Google-based sign-in for secure access.
- **Social Features:** Follow/unfollow functionality for building connections.
- **Search:** Query nearby followings and followers of a user based on userid and a scale value.

## File Structure
```
restuful-api/
├── src/
│   ├── controllers/
│   │   ├── userController.js   # Handles logic for user related endpoints
│   │   └── authController.js   # Handles authentication/authorization related logic
│   ├── models/
│   │   └── userModel.js        # Defines database schema for users
│   ├── routes/
│   │   ├── userRoutes.js       # User-related routes
│   │   └── authRoutes.js       # Authentication-related routes
│   └── middlewares/
│       ├── authMiddleware.js   # Middleware for jwt-token authentication checks
│       └── loggerMiddleware.js # Middleware for logging requests
├── logs/
│   └── server.log              # Log file for logging on selected routes
├── helpers/
│   └── generateUsers.js        # Script to generate users
├── tests/
│   └── userTests.js            # Script to test users related controller
├── app.js                      # Main application file for global configuration
├── server.js                   # Main entery file for start server
└── package.json                # Project metadata and dependencies
```

## Prerequisites
- **Node.js and npm/yarn:** Ensure you have Node.js installed on your system.
- **Database:** Set up a MongoDB Atlas cluster and obtain the connection string.
- **Environment Variables:** Create a `.env` file in the root directory with the following keys:
    ```
    MONGO_URI=your_mongodb_atlas_connection_string
    JWT_SECRET=your_jwt_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GOOGLE_REDIRECT_URI=your_google_redirect_uri
    PORT=your_server_port
    ```

## Installation

### Clone the repository:
```bash
git clone https://github.com/shincyls/restful-api.git
cd restful-api
```

### Install dependencies:
```bash
npm install
```

### Set up the database:
- Ensure your MongoDB Atlas cluster is running and accessible.

## Running the Code

### Start the server in development mode:
```bash
npm run dev
```

### Start the server in production mode:
```bash
npm start
```

### Access the API:
Use the base URL from your `.env` file or `http://localhost:<PORT>` for local development.

## Testing the API
- Open Postman or any other API client.
- Set the base URL for your requests (e.g., `http://localhost:3000`).
- Test the endpoints with the payloads and methods defined in the Postman Documentation.
- For authenticated routes, include the JWT token in the Authorization header:
    ```
    Authorization: Bearer <your_token>
    ```

