import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";

// Setting up WHAT strategy that Passport is going ot use
passport.use(
  // in this case, we're gonna use Github
  new GitHubStrategy(
    {
      // We need 3 pieces of info

      // 1. the Client ID, Identify our registered app on GitHub
      clientID: process.env.GITHUB_CLIENT_ID, // Kinda like a Username for the application
      
      // 2. the Client Secret, Secret key for our app
      clientSecret: process.env.GITHUB_CLIENT_SECRET, // Kinda like the Password, for the application
    
      // 3. The Github Callback URL, Address to which GitHub will return the user after authenticating them
      callbackURL: process.env.GITHUB_CALLBACK_URL, // e.g., 'http://localhost:3001/api/users/auth/github/callback'

      
      //4. user:email: requests permission to access the user's email addresses on GitHub.
      // We need to get the email to identify the user and link their GitHub account to an existing local account.
      scope: ['user:email'] 
    },


    // This is the "verify" callback
    // accessToken and refreshToken are credentials related to OAuth
    // The OAuth (Open Authorization) protocol lets an app access certain user resources using another service,
    // without the user having to share their password with that app.
    async (accessToken, refreshToken, profile, done) => {
      try {

        // we get the user's email that GitHub returns in the profile object
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('GitHub email not available'));
        }


        // The "profile" object contains the user's GitHub information
        // check in MongoDB if a user is already registered with that GitHub ID
        const existingUser = await User.findOne({ githubId: profile.id });

        if (existingUser) {
          // If user already exists, pass them to the next middleware
          return done(null, existingUser);
        }
        // ========================================
        // Check if the email already exists
        // ========================================
        existingUser = await User.findOne({ email });

        if (existingUser) {

          // Link the GitHub account to the existing user
          if (!existingUser.githubId) {
            existingUser.githubId = profile.id;
            await existingUser.save();
          }

          return done(null, existingUser);
        }

        // If it's a new user, create a record in our database
        const newUser = new User({
            username: profile.username, // get the username from GitHub
          githubId: profile.id, // And the GitHub ID (which tells the User we don't need a password)
          email: profile._json.email, // Some providers return an array of emails
        });

        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err);
      }
    },
  ),
);

// These functions are needed for session management
passport.serializeUser((user, done) => {
  done(null, user.id); //Save the user ID in the session.
});

passport.deserializeUser((id, done) => {
  // Retrieve the user from MongoDB using their ID. And the routes can access the user's information.
  User.findById(id, (err, user) => done(err, user)); 