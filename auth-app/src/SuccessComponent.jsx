import React, { useEffect } from "react";

const SuccessComponent = ({ navigateToLogin, handleRegistration }) => {
  // Use useEffect to automatically call handleRegistration when component mounts
  useEffect(() => {
    // Call handleRegistration as soon as the component renders
    if (handleRegistration) {
      handleRegistration();
    }
  }, [handleRegistration]); // Dependency array ensures the effect runs only once, when `handleRegistration` changes

  return (
    <div>
      <h2>Success!</h2>
      <p>You have successfully registered/logged in.</p>
      <p style={{ textAlign: "center", marginTop: "10px" }}>
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
    </div>
  );
};

export default SuccessComponent;