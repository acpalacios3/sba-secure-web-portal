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
userSchema.pre("save", async function () {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
