const User = require("../models/User");

// register a new user
const addUser = async (userInfo, res) => {
  try {
    const { mobile, name } = userInfo;

    if (mobile) {
      // If the email or phone is already present in the db
      // The phone must be verified in either case

      const user = await User.findOne({
        $and: [{ "mobile.value": mobile }, { "mobile.verified": true }],
      });

      // Existing user
      if (user) {
        return res.status(304).json({
          success: false,
          message: "User already registered",
        });
      } else {
        // Creating a new user
        const _user = new User({
          "mobile.value": userInfo.mobile,
          "mobile.verified": true,
          name: name,
        });
        await _user.save();
        return res.status(200).json({
          success: true,
          data: user,
        });
      }
    }
  } catch (err) {
    return err;
  }
};

// login a user
const loginUser = async (userInfo, res) => {
  try {
    const { mobile } = userInfo;
    if (mobile) {
      const user = await User.findOne({
        $and: [{ "mobile.value": mobile }, { "mobile.verified": true }],
      });

      // Existing user
      if (!user) {
        return res.status(304).json({
          success: false,
          message: "User not registered",
        });
      } else {
        return res.status(200).json({
          success: true,
          data: user,
        });
      }
    }
  } catch (error) {
    return error;
  }
};

const updateUser = async (userInfo, next) => {
  try {
  } catch (error) {}
};

module.exports = {
  addUser,
  loginUser,
};
