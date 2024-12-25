import React, { useState } from "react";
import RegisterComponent from "./RegisterComponent";
import LoginComponent from "./LoginComponent";
import SuccessComponent from "./SuccessComponent";

import "./App.css"; // Optional global styles

const App = () => {
  const [mode, setMode] = useState("register"); // Modes: 'register', 'login', 'success'

  const handleSuccess = () => {
    setMode("success"); // Move to the success page
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      {mode === "register" && (
        <div>
          <RegisterComponent onSuccess={handleSuccess} />
          <p style={{ textAlign: "center", marginTop: "10px" }}>
            Already have an account?{" "}
            <button
              style={{ background: "none", color: "#007bff", border: "none", cursor: "pointer" }}
              onClick={() => setMode("login")}
            >
              Login
            </button>
          </p>
        </div>
      )}

      {mode === "login" && (
        <div>
          <LoginComponent onSuccess={handleSuccess} />
          <p style={{ textAlign: "center", marginTop: "10px" }}>
            Don't have an account?{" "}
            <button
              style={{ background: "none", color: "#007bff", border: "none", cursor: "pointer" }}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </p>
        </div>
      )}

      {mode === "success" && <SuccessComponent />}
    </div>
  );
};

export default App;
