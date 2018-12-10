const Modal = ({ handleClose, show, children }) => {

  /*
    Returns a modal object, containing the passed in children
  */
  return (
    <div className={show ? "modal modalOpen" : "modal modalClosed"}>
      <section className="modalContent">
          {children}
          <img className="closeButton" onClick={handleClose} src="assets/img/close.svg"/>
      </section>
    </div>
  );
};