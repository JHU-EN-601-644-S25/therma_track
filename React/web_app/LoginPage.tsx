import LoginComp from "./LoginComp";
import { useNavigate } from "react-router-dom";
import utilsFuncs from "./utils";
import { useState } from "react";
import TwoFactorAuthComp from "./TwoFactorAuthComp";
import TwoFactorAuthInitComp from "./TwoFactorAuthInitComp";

const allow_signup = false;

function LoginPage() {
  const [initVerifier, setInitVerifier] = useState(false);
  const [userId, setUserId] = useState(-1);
  const [verifier, setVerifier] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const navigate = useNavigate();

  return (
    <div
      className="fixed-center"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <LoginComp
        nameClass="username"
        auxClass="password"
        buttonText="Login"
        onLoginSubmit={(identifier, user_id, img_src) => {
          setImgSrc(img_src);
          if (img_src) {
            setInitVerifier(true);
          } else {
            setVerifier(true);
          }
          setIdentifier(`/${identifier}` + user_id);
          setUserId(user_id);
        }}
        onAuxChecker={utilsFuncs.handleLogin}
      />
      {allow_signup && (
        <p
          className="spaced"
          style={{
            textDecoration: "underline",
            textDecorationColor: "blue",
            cursor: "pointer",
          }}
          onClick={() => {
            navigate("/signup");
          }}
        >
          Don't have an account? Sign up here!
        </p>
      )}
      {initVerifier && (
        <TwoFactorAuthInitComp
          image_src={imgSrc}
          closePopup={() => {
            setInitVerifier(false);
            setVerifier(true);
          }}
        />
      )}
      {verifier && (
        <TwoFactorAuthComp
          get_user_id={() => userId}
          check_func={utilsFuncs.handleLoginCheck}
          set_auth_status={(status) => {
            if (status) {
              navigate(identifier);
            }
            setVerifier(false);
          }}
        />
      )}
    </div>
  );
}

export default LoginPage;
