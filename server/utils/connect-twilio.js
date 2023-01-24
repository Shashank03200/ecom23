const twilio = require("twilio");
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

const sendMobileCode = (mobile) => {
  return client.verify.v2
    .services(process.env.TWILIO_SERVICE_ID)
    .verifications.create({ to: `+91 ${mobile}`, channel: "sms" });
};

const verifyMobileCode = (mobile, verificationCode) => {
  return client.verify.v2
    .services(process.env.TWILIO_SERVICE_ID)
    .verificationChecks.create({
      to: `+91 ${mobile}`,
      code: verificationCode,
    });
};

module.exports = { client, sendMobileCode, verifyMobileCode };
