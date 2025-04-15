interface props {
  onClose: () => void;
  children: React.ReactNode;
}

function PopupComp({ onClose, children }: props) {
  return (
    <>
      <button className="spaced" onClick={onClose}>
        ✖
      </button>
      {children}
    </>
  );
}

export default PopupComp;
