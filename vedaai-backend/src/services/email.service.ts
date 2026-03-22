import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  await transporter.sendMail({
    from: `"VedaAI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for VedaAI",
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Verify your email</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This OTP is for login/signup.</p>
      </div>
    `,
  });
};