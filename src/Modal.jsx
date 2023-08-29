import "./Modal.css";

const Modal = (props) => {
  return (
    <>
      <div onClick={props.onClose} className="backdrop"></div>
      <div className="modal">
      <center><h2>{props.title}</h2>
        <p>{props.message}</p>
        <button onClick={props.onClose}>Ok</button>
        </center> 
      </div>
    </>
  );
};

export default Modal;
