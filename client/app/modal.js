const Modal = ({ handleClose, show, children }) => {

    return (
      <div className={show ? "modal modalOpen" : "modal modalClosed"}>
        <section className="modalContent">
            {children}
            <img className="closeButton" onClick={handleClose} src="assets/img/close.svg"/>
        </section>
      </div>
    );
};