const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },

  address: {
    type: String,
    trim: true,
  },
  mobile: {
    value: {
      type: String,
      required: true,
      unique: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  role: {
    type: Number,
    default: 0, // Customer
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (err) {
    console.log(err.message);
    next();
  }
});

userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
