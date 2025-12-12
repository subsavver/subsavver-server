"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRemainderEmail = exports.transporter = void 0;
const path_1 = __importDefault(require("path"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
const config_1 = __importDefault(require("../config/config"));
exports.transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: config_1.default.gmail.user,
        pass: config_1.default.gmail.pass,
    },
});
// Attach the template engine
exports.transporter.use("compile", (0, nodemailer_express_handlebars_1.default)({
    viewEngine: {
        extname: ".hbs",
        partialsDir: path_1.default.resolve(__dirname, "../templates"),
        defaultLayout: undefined,
    },
    viewPath: path_1.default.resolve(__dirname, "../templates"),
    extName: ".hbs",
}));
const sendRemainderEmail = async (to, subject, data) => {
    try {
        const mailOptions = {
            from: `SubSavver 🧠 <${config_1.default.gmail.user}>`,
            to,
            subject,
            template: "reminder",
            context: { ...data },
        };
        const info = await exports.transporter.sendMail(mailOptions);
        if (info.rejected.length === 0 && info.accepted.length > 0) {
            console.log("✅ Email sent successfully to: ", to);
            return true;
        }
        else {
            console.log("Email sending failed to: ", info.rejected);
            return false;
        }
    }
    catch (error) {
        console.log("❌ Failed to send email: ", error);
    }
};
exports.sendRemainderEmail = sendRemainderEmail;
