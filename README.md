## SBA Secure Web Portal

### Overview

“Innovate Inc.” is ready for the final phase of its new user portal. They need a full and secure backend service; this service will be the single entry point for all users, managing their identities and private data.

Build a secure Express application that allows users to sign up, log in (using both their email/password and an external provider like GitHub), and manage a private collection of personal “bookmarks” (or notes, tasks, etc.). Handle everything from password hashing to implementing complex OAuth 2.0 flows.

### Technologies:

* Node.js – JavaScript runtime environment.
* Express.js – Backend framework for building RESTful APIs.
* MongoDB – NoSQL database.
* Mongoose – MongoDB object modeling.
* bcrypt – Password hashing and verification.
* jsonwebtoken (JWT) – Token generation and authentication.
* dotenv – Environment variable management.
* Passport.js – Authentication middleware.
* passport-github2 – GitHub OAuth 2.0 authentication strategy.
* Postman – API testing.
* Git & GitHub – Version control.

### Features

1. Local User Authentication

The application supports local user authentication using email and password.
User registration.
Password hashing using bcrypt.
Password verification during login.
JWT generation after successful authentication.
Token verification through authentication middleware.

2. GitHub OAuth 2.0 Authentication

The project incorporates third-party authentication using GitHub and Passport.js.
GitHub OAuth authentication strategy.
Redirect users to GitHub for authentication.
GitHub authentication callback.
Find existing users or create new user accounts.
Generate a JWT after successful authentication.

3. Bookmark Management (CRUD)
Authenticated users can manage their personal bookmarks.
Implement full CRUD functionality (POST, GET All, GET One, PUT, DELETE)

4. Authentication and Authorization

### Authentication
The authMiddleware verifies JWT tokens and identifies authenticated users.

The middleware:
* Retrieves the JWT from the request.
* Verifies the token using the secret key.
* Checks token expiration.
* Attaches the authenticated user information to req.user.
* Rejects missing or invalid tokens with HTTP 401.

### Authorization

The application implements resource ownership verification.
Users can only access and manage bookmarks associated with their own user ID.

* GET All filters bookmarks using req.user._id.
* GET One verifies bookmark ownership.
* PUT verifies ownership before updating.
* DELETE verifies ownership before deleting.
* POST automatically assigns the authenticated user's ID.

Unauthorized access attempts return HTTP 403 Forbidden.

### Database Models

User Model: The User model supports local and third-party authentication.

It accommodates:
* User email.
* Password for local authentication.
* GitHub ID for third-party authentication.

The email field is unique and connects local and GitHub identities.

Bookmark Model: The Bookmark model stores personal resources associated with an authenticated user.

Field (title,url, Descripcion,,title,createdArt, user)
user ObjectId, The user field establishes the relationship between bookmarks and their owners.

### API Endpoints:

* User Authentication:   Base URL: /api/users

POST /register  Register a new user
POST /login     Authenticate a user and return a JWT
GET /auth/github Initiate GitHub OAuth authentication
GET /auth/github/callback Handle the GitHub authentication callback

Bookmark Resources: Base URL: /api/bookmarks

GET / Retrieve all bookmarks owned by the authenticated user
GET /:id Retrieve one bookmark by ID
POST / Create a new bookmark
PUT /:id Update an existing bookmark
DELETE /:id Delete a bookmark

All bookmark endpoints require authentication.

### JWT Authentication

Protected endpoints require a valid JWT in the Authorization header.
Authorization: Bearer YOUR_JWT_TOKEN
The auth.js utility contains two main functions:
* signToken() – Generates a signed JWT containing the user's information.
* authMiddleware() – Verifies the JWT and attaches the decoded user information to req.user.

### Environment Configuration

Create a .env file in the project root directory.

PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=your_github_callback_url

Security Note: Never commit your .env file or expose database credentials, JWT secrets, or GitHub credentials in a public repository.

### Installation and Setup

1. Install Dependencies
npm install

2. Configure Environment Variables
Create your .env file and configure the required MongoDB, JWT, and GitHub OAuth credentials.

3. Start the Application

Use the development or start command configured in package.json.
The application runs locally on:
http://localhost:3001

## Testing

API endpoints can be tested using Postman.
The testing examples are in the images folder
