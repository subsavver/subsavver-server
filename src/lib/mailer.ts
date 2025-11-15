import path from "path";
import nodemailer from "nodemailer";
import { compile } from "handlebars";
import hbs from "nodemailer-express-handlebars";
import config from "../config/config";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.gmail.user,
    pass: config.gmail.pass,
  },
});

// Attach the template engine
transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".hbs",
      partialsDir: path.resolve(__dirname, "../templates"),
      defaultLayout: undefined,
    },
    viewPath: path.resolve(__dirname, "../templates"),
    extName: ".hbs",
  })
);

export const sendRemainderEmail = async (
  to: string,
  subject: string,
  data: {
    name: string;
    serviceName: string;
    renewalDate: string;
    dashboardLink: string;
    paymentLink: string;
  }
) => {
  try {
    const mailOptions = {
      from: `SubSavver 🧠 <${config.gmail.user}>`,
      to,
      subject,
      template: "reminder",
      context: { ...data },
    };
    const info = await transporter.sendMail(mailOptions);

    if (info.rejected.length === 0 && info.accepted.length > 0) {
      console.log("✅ Email sent successfully to: ", to);
      return true;
    } else {
      console.log("Email sending failed to: ", info.rejected);
      return false;
    }
  } catch (error: unknown) {
    console.log("❌ Failed to send email: ", error);
  }
};
