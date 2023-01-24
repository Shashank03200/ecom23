const { AUTH_MODES } = require("../constants");
const {
  client,
  sendMobileCode,
  verifyMobileCode,
} = require("../utils/connect-twilio");
const { addUser, loginUser } = require("../repository/user.repository");

const authUser = (req, res, next) => {
  const { mobile } = req.body;

  try {
    sendMobileCode(mobile).then((verification) => {
      console.log(verification.status);
      res.json({
        success: true,
        msg: "Verification Code Sent",
      });
    });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = (req, res, next) => {
  const { mode } = req.params;
  const userInfo = req.body;
  const { mobile, code: verificationCode } = userInfo;

  try {
    verifyMobileCode(mobile, verificationCode).then(
      async (verification_check) => {
        console.log(verification_check);
        if (verification_check.status === "approved") {
          if (mode === AUTH_MODES.LOGIN) {
            await loginUser(userInfo, res);
          } else if (mode === AUTH_MODES.REGISTER) {
            await addUser(userInfo, res);
          }
        } else if (verification_check.status === "canceled") {
          return res.json({
            success: false,
            message: "Invalid OTP",
          });
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authUser,
  verifyOTP,
};
