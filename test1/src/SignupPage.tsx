// import { useState } from "react";
import LoginComp from "./LoginComp";
import { useNavigate } from "react-router-dom";
import utilsFuncs from "./utils";

function SignupPage() {
  const navigate = useNavigate();

  return (
    <div
      className="fixed-center"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <LoginComp
        nameClass="username"
        auxClass="password"
        buttonText="Signup"
        onLoginSubmit={(identifier) => {
          navigate(`/${identifier}`);
        }}
        onAuxChecker={utilsFuncs.handleSignup}
      />
      <p
        className="spaced"
        style={{
          textDecoration: "underline",
          textDecorationColor: "blue",
          cursor: "pointer",
        }}
        onClick={() => {
          navigate("/");
        }}
      >
        Already have an account?
      </p>
    </div>
  );
}

export default SignupPage;
