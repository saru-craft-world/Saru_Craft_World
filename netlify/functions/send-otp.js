const { Resend } = require("resend");
const admin = require("firebase-admin");
const crypto = require("crypto");

function getFirebase() {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

  return admin.firestore();
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        error: "Method not allowed"
      })
    };
  }

  try {
    const { email } = JSON.parse(event.body || "{}");

    if (
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Enter a valid email address."
        })
      };
    }

    if (
      !process.env.RESEND_API_KEY ||
      !process.env.FIREBASE_SERVICE_ACCOUNT
    ) {
      throw new Error("Server configuration is missing.");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const db = getFirebase();

    const otp = crypto
      .randomInt(0, 1000000)
      .toString()
      .padStart(6, "0");

    const otpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const docId = crypto
      .createHash("sha256")
      .update(normalizedEmail)
      .digest("hex");

    const otpRef = db.collection("emailOTPs").doc(docId);

    await otpRef.set({
      email: normalizedEmail,
      otpHash,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
      verified: false
    });

    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: normalizedEmail,
      subject: "Saru Crafts World - Email Verification OTP",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px">
          <h2>Saru Crafts World 🧶</h2>
          <p>Your email verification OTP is:</p>
          <h1 style="letter-spacing:8px">${otp}</h1>
          <p>This OTP expires in 5 minutes.</p>
          <p>Please do not share this code with anyone.</p>
        </div>
      `
    });

    if (result.error) {
      await otpRef.delete();

      return {
        statusCode: 502,
        body: JSON.stringify({
          error: "Email could not be sent. Check your Resend configuration."
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "OTP sent successfully."
      })
    };

  } catch (error) {
    console.error("Send OTP error:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Unable to send OTP. Check server configuration."
      })
    };
  }
};
