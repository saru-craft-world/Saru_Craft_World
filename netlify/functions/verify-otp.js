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
    const { email, otp } = JSON.parse(event.body || "{}");

    if (!email || !otp) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Email and OTP are required"
        })
      };
    }

    return {
      statusCode: 501,
      body: JSON.stringify({
        error: "OTP verification is not configured yet."
      })
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid request"
      })
    };
  }
};
