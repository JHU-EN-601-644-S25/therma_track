import PopupComp from "./PopupComp";

interface Props {
  image_src: string | null;
  closePopup: () => void;
}

function TwoFactorAuthInitComp({ image_src, closePopup }: Props) {
  return (
    <PopupComp
      onClose={() => closePopup()}
      children={
        <div className="spaced">
          <label>Use the QRcode below to check in : </label>
          {image_src && <img src={image_src} alt="QR Code for 2FA setup" />}
          <button
            className="spaced"
            onClick={() => {
              closePopup();
            }}
          >
            Close
          </button>
        </div>
      }
    />
  );
}

export default TwoFactorAuthInitComp;
