import mongoose from "mongoose";
import bcrypt from "bcrypt";

/**
 * Mongoose schema to represent a user.
 */
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    token: {
      type: String,
    },
    confirm: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Middleware to hash the password before saving the user to the database.
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Method to verify if the provided password matches the stored password.
 * @param {string} passwordForm - The provided password to verify.
 * @returns {Promise<boolean>} Returns true if the password matches, otherwise false.
 */
userSchema.methods.checkPassword = async function (passwordForm) {
  return await bcrypt.compare(passwordForm, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
