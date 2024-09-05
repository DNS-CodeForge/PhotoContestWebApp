import classes from './Modal.module.css';

function Modal({ children }) {
    return (
        <div className={classes.background}>
            <dialog className={classes.modal}>
                {children}
            </dialog>
        </div>
    );
}


export default Modal;