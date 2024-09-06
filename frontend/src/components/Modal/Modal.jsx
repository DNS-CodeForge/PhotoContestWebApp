import { useRef } from 'react';
import classes from './Modal.module.css';

function Modal({ children, onClose }) {
    const dialogRef = useRef(null);

    const handleClose = (e) => {
        
        if (e.target === e.currentTarget) {
            dialogRef.current.close(); 
            if (onClose) onClose();
        }
    };

    return (
        <div className={classes.background} onClick={handleClose}>
            <dialog className={classes.modal} ref={dialogRef} open>
                {children}
            </dialog>
        </div>
    );
}

export default Modal;
