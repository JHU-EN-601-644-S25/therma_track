import { useState } from "react";

interface props {
  nameClass: string;
  auxClass: string;
  buttonText: string;
  onLoginSubmit: (identifier: string) => void;
  onAuxChecker: (name: string, aux: string) => Promise<[boolean, string]>;
}

function LoginComp({
  nameClass,
  auxClass,
  buttonText,
  onLoginSubmit,
  onAuxChecker,
}: props) {
  const [name, setName] = useState("");
  const [aux, setAux] = useState("");
  const [error, setError] = useState("");

  return (
    <div>
      <div>
        {nameClass && (
          <div className="spaced">
            <label>{nameClass}: </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
        )}
        {auxClass && (
          <div className="spaced">
            <label>{auxClass}: </label>
            <input
              type={auxClass === "password" ? "password" : "text"}
              value={aux}
              placeholder="Enter your password"
              onChange={(e) => {
                setAux(e.target.value);
              }}
            />
          </div>
        )}
        {error && (
          <p
            className="spaced"
            style={{
              color: "red",
            }}
          >
            {error}
          </p>
        )}
        <button
          className="spaced"
          onClick={async () => {
            if ((!nameClass && !name) || (!auxClass && !aux)) {
              setError("Incomplete information");
              return;
            }
            const [result, errorMsg] = await onAuxChecker(name, aux);
            if (!result) {
              setError(errorMsg); 
            } else {
              setError("");
              onLoginSubmit(errorMsg);
            }
          }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default LoginComp;
