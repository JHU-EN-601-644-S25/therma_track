import { useState } from "react";

interface props {
  nameClass: string;
  auxClass: string;
  buttonText: string;
  onLoginSubmit: (
    identifier: string,
    patient_id: number,
    image_src: string | null
  ) => void;
  onAuxChecker: (
    name: string,
    aux: string
  ) => Promise<[boolean, string, number, string | null]>;
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
      {nameClass && (
        <div className="spaced">
          <label>{nameClass}: </label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      )}
      {auxClass && (
        <div className="spaced">
          <label>{auxClass}: </label>
          <input
            type={auxClass === "password" ? "password" : ""}
            value={aux}
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
          const [result, errorMsg, user_id, qrcode] = await onAuxChecker(
            name,
            aux
          );
          if (!result) {
            setError(errorMsg);
          } else {
            onLoginSubmit(errorMsg, user_id, qrcode);
            setError("");
          }
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default LoginComp;
