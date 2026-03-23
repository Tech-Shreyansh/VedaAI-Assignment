import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
  tls: {
    rejectUnauthorized: false,
  },
  family: 4,
} as SMTPTransport.Options);

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