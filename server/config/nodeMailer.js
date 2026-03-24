import nodemailer from "nodemailer"

const readEnv = (...keys) => {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim().replace(/^["']|["']$/g, "");
    }
  }
  return "";
};

const mailConfig = {
  host: readEnv("SMTP_HOST") || "smtp-relay.brevo.com",
  port: Number(readEnv("SMTP_PORT") || 587),
  secure: readEnv("SMTP_SECURE") === "true",
  user: readEnv("SMTP_USER", "BREVO_SMTP_LOGIN", "BREVO_LOGIN"),
  pass: readEnv("SMTP_PASS", "BREVO_SMTP_KEY", "BREVO_API_KEY"),
  from: readEnv("SENDER_EMAIL", "SMTP_FROM", "MAIL_FROM"),
};

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: mailConfig.secure,
    auth: {
      user: mailConfig.user,
      pass: mailConfig.pass,
    },
  });

  return transporter;
};

const assertMailConfig = () => {
  const missing = [];

  if (!mailConfig.user) missing.push("SMTP_USER");
  if (!mailConfig.pass) missing.push("SMTP_PASS");
  if (!mailConfig.from) missing.push("SENDER_EMAIL");

  if (missing.length) {
    throw new Error(`Mail configuration is incomplete. Missing: ${missing.join(", ")}`);
  }
};

const normalizeMailError = (error) => {
  if (error?.responseCode === 535 || error?.code === "EAUTH") {
    return new Error(
      "SMTP authentication failed. Update the active SMTP credentials in your server environment."
    );
  }

  return error;
};

const sendEmail = async ({ to, subject, body }) => {
  assertMailConfig();

  try {
    return await getTransporter().sendMail({
      from: `Quickshow <${mailConfig.from}>`,
      to,
      subject,
      html: body,
    });
  } catch (error) {
    throw normalizeMailError(error);
  }
}

export default sendEmail;
