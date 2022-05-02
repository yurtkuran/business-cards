import React from 'react';
import ReactDom from 'react-dom';
import './modal.css';

export default function Modal({ title, children, show, onClose }) {
    if (!show) return null;

    return ReactDom.createPortal(
        <>
            <div className='modal-overlay' />
            <div className='modal-content'>
                <div className='modal-header'>
                    <h4 className='modal-title'>{title}</h4>
                </div>

                <div className='modal-body'>{children}</div>

                <div className='modal-footer'>
                    <button className='btn-outline-primary btn-sm mr-2' onClick={onClose}>
                        Close
                    </button>
                    <button className='btn-danger btn-sm' onClick={() => onClose('delete')}>
                        Delete
                    </button>
                </div>
            </div>
        </>,
        document.getElementById('portal')
    );
}
