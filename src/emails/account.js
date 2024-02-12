const sgMail = require("@sendgrid/mail");

// const sendgridAPIKey =
//   "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";

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "lishak@mre.co",
    subject: "Thanks for Joining in!",
    text: `WELCOME ${name}. AMAZING`,
  });
};
const sendCacnelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "lishak@mre.co",
    subject: "BYE",
    text: `Dont come back ever ${name}.`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCacnelationEmail,
};
