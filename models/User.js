import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Must match an email address!"],
  },
  // going to need a githubId field to have this work
  githubId: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.githubId // What does THIS do?
      // IF we do not have a githubId, then this field is required
      // if we DO have a githubId, we do not need this field.
    },
    minlength: 8,
  }
});

// hash user password
// pre("save"): runs this function before saving the user in MongoDB

userSchema.pre("save", async function () {

  // Since GitHub users don’t need a password, the middleware should avoid running bcrypt.hash() 
  // when this.password exists, so we check it in the if
  if (this.password && (this.isNew || this.isModified("password"))) {
    const saltRounds = 10; //sets the cost of the hash process.
    this.password = await bcrypt.hash(this.password, saltRounds); //generate the password hash
  }
});

// custom method to compare and validate password for logging in
// password: password that the user types when logging in
// this.password: encrypted password that is stored in MongoDB
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
