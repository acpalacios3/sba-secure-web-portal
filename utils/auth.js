import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET; // Secret key used to sign and verify JWT tokens
const expiration = "2h"; // Token expiration

// Middleware to verify the JWT and protect private routes
export function authMiddleware(req, res, next) {

    // Get the token
    let token = req.body?.token || req.query?.token || req.headers.authorization;

    // IF Get the token from the Authorization header
    if (req.headers.authorization) {

        // Extract the token from the "Bearer <token>" format.
        // pop() returns the last element of the array.
        // trim() removes any extra whitespace.
        token = token.split(" ").pop().trim();
    }

    // If no token is provided, deny access
    if (!token) {
        return res
            .status(401)
            .json({ message: "You must be logged in to do that." });
    }

    try {

        // Verify the token using the secret key.
        // maxAge checks that the token is not older than expiration hours.
        const { data } = jwt.verify(token, secret, { maxAge: expiration });

        // attach the decoded user information to the request
        // Other routes can access this information through req.user
        req.user = data;

    } catch {
        console.log("Invalid token");
        return res.status(401).json({ message: "Invalid token." });
    }
    // continue to the next middleware or route handler
    next();
}

// Generate a JWT for an authenticated user
export function signToken({ username, email, _id }) {

    //  create the information that will be stored inside the token
    const payload = { username, email, _id };
    //  Sign the payload with the secret key and set its expiration
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}
