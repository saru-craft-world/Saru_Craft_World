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
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { email, otp } = JSON.parse(event.body || "{}");

    if (
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !/^\d{6}$/.test(String(otp || ""))
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Valid email and 6-digit OTP are required."
        })
      };
    }

    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      throw new Error("Firebase configuration is missing.");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const db = getFirebase();

    const docId = crypto
      .createHash("sha256")
      .update(normalizedEmail)
      .digest("hex");

    const otpRef = db.collection("emailOTPs").doc(docId);

    const result = await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(otpRef);

      if (!snapshot.exists) {
        return { ok: false, message: "OTP not found. Request a new OTP." };
      }

      const data = snapshot.data();

      if (data.email !== normalizedEmail) {
        return { ok: false, message: "Invalid OTP request." };
      }

      if (Date.now() > data.expiresAt) {
        transaction.delete(otpRef);
        return { ok: false, message: "OTP expired. Request a new OTP." };
      }

      if (data.verified) {
        return { ok: false, message: "OTP has already been used." };
      }

      if ((data.attempts || 0) >= 5) {
        transaction.delete(otpRef);
        return { ok: false, message: "Too many attempts. Request a new OTP." };
      }

      const submittedHash = crypto
        .createHash("sha256")
        .update(String(otp))
        .digest("hex");

      if (submittedHash !== data.otpHash) {
        transaction.update(otpRef, {
          attempts: (data.attempts || 0) + 1
        });

        return { ok: false, message: "Incorrect OTP." };
      }

      transaction.update(otpRef, {
        verified: true,
        verifiedAt: Date.now()
      });

      return { ok: true, message: "Email verified successfully." };
    });

    return {
      statusCode: result.ok ? 200 : 400,
      body: JSON.stringify({
        success: result.ok,
        message: result.message
      })
    };
  } catch (error) {
    console.error("Verify OTP error:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "OTP verification failed. Check server configuration."
      })
    };
  }
};
