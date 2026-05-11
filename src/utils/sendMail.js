import nodemailer from "nodemailer";

export const sendMail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset OTP",
    html: `
      <h2>Your OTP Code</h2>
      <h1>${otp}</h1>
      <p>This OTP expires in 5 minutes</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};
