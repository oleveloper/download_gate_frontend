import React, { useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

function ToastMessage({ message }) {
    const [show, setShow] = useState(true);

    return (
        <ToastContainer position="top-end" className="p-3">
            <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
                <Toast.Header>
                    <strong className="me-auto">Notification</strong>
                </Toast.Header>
                <Toast.Body>{message}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

export default ToastMessage;
