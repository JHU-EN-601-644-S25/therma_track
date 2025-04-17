import { useState } from "react";
import PopupComp from "./PopupComp";

interface Props {
  get_user_id: () => number;
  check_func: (id: number, input: string) => Promise<[boolean, string]>;
  set_auth_status: (status: boolean) => void;
}

function TwoFactorAuthComp({
  get_user_id,
  check_func,
  set_auth_status,
}: Props) {
  const [numFails, setNumFails] = useState(0);
  const [errMsg, setErrMsg] = useState("");
  const [inputCode, setInputCode] = useState("");

  return (
    <PopupComp
      onClose={() => set_auth_status(false)}
      children={
        <div className="spaced">
          <label>Plese input the verification code you received: </label>
          <input
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
          <button
            className="spaced"
            onClick={async () => {
              const user_id = get_user_id();
              const [check_result, msg] = await check_func(user_id, inputCode);
              if (!check_result && msg !== "") {
                setErrMsg(msg);
              } else if (check_result) {
                set_auth_status(true);
              } else {
                setNumFails(numFails + 1);
                if (numFails < 5) {
                  setErrMsg(
                    `Invalid authorization code. ${
                      5 - numFails
                    } trials remaining`
                  );
                } else {
                  set_auth_status(false);
                }
              }
            }}
          >
            Submit
          </button>
          {errMsg && (
            <p
              style={{
                color: "red",
              }}
            >
              {`${errMsg}`}
            </p>
          )}
        </div>
      }
    />
  );
}

export default TwoFactorAuthComp;
