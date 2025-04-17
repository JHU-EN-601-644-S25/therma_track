import PopupComp from "./PopupComp";
interface Props {
  patient_name: string;
  set_verified_status: (val: boolean) => void;
}

function PatientConnectVerificationComp({
  patient_name,
  set_verified_status,
}: Props) {
  return (
    <PopupComp
      onClose={() => {
        set_verified_status(false);
      }}
      children={
        <div>
          <label>
            Are you sure you want to connect to {`${patient_name}`}?
          </label>
          <button
            onClick={() => {
              set_verified_status(true);
            }}
          >
            Connect
          </button>
          <button
            onClick={() => {
              set_verified_status(false);
            }}
          >
            Cancel
          </button>
        </div>
      }
    />
  );
}

export default PatientConnectVerificationComp;
