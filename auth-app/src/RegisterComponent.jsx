import React, { useState } from "react";
import "./AuthStyles.css"; // Import the custom CSS for styling

const RegisterComponent = ({ onSuccess, navigateToLogin }) => { // Destructure navigateToLogin
  const [step, setStep] = useState(1); // Tracks registration process steps: input email/password -> OTP.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  // Step 1: Register user and send verification code
  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth_service/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.text();
      if (response.ok) {
        console.log(data); // Log success message
        setStep(2); // Proceed to OTP verification
        setError(""); // Clear previous errors
      } else {
        setError(data || "Failed to send verification code.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An unexpected error occurred. Try again later.");
    }
  };

  // Step 2: Verify the code entered by the user
  const handleVerifyOtp = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth_service/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: otp }),
      });

      const data = await response.text();
      if (response.ok) {
        console.log(data); // Log success message
        onSuccess(); // Call the success callback to proceed to the success screen
        setError("");
      } else {
        setError(data || "Incorrect OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An unexpected error occurred. Try again later.");
    }
  };

  // Step 3: Send final registration data to /api/auth_service/registration
  const handleRegistration = async () => {
    try {
      // Send POST request to register the user with a role (e.g., ADMIN)
      const response = await fetch("http://localhost:8080/api/auth_service/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role: "ADMIN" }),
      });

      const data = await response.text(); // Expecting a JSON response from the backend
      if (response.ok) {
        console.log("Registration successful:", data);
        navigateToLogin(); // Redirect to the login page
      } else {
        setError(data || "Failed to complete registration.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An unexpected error occurred while registering. Try again later.");
    }
  };


  return (
    <div>
      {step === 1 && (
        <div>
          <h2>Register</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleRegister}>Register</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        )}
  
        {step === 2 && (
          <div>
            <h2>Enter OTP</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOtp}>Verify OTP</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        )}
  
        {/* Optionally, you can add a "Back to Login" button to manually trigger navigateToLogin */}
        {step === 1 && (
          <p style={{ textAlign: "center", marginTop: "10px" }}>
            Already have an account?{" "}
            <button
              style={{
                background: "none",
                color: "#007bff",
                border: "none",
                cursor: "pointer",
              }}
              onClick={navigateToLogin} // Call navigateToLogin when this button is clicked
            >
              Login Here
            </button>
          </p>
        )}
      </div>
    );
  };
  
  export default RegisterComponent;
  