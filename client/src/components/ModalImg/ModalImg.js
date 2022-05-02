// references
// https://stackoverflow.com/questions/63074577/close-modal-popup-using-esc-key-on-keyboard

// bring in dependencies
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import './modalImg.scss';

// bring in redux

// bring in components

// bring in actions

// bring in functions and hooks

// set initial state

const ModalImg = ({ selectedImg, setSelectedImg }) => {
    useEffect(() => {
        const close = (e) => {
            if (e.key === 'Escape') {
                setSelectedImg(null);
            }
        };
        window.addEventListener('keyup', close);
        return () => window.removeEventListener('keyup', close);
    }, []);

    return (
        <div className='backdrop' onClick={() => setSelectedImg(null)}>
            <img src={selectedImg} />
        </div>
    );
};

ModalImg.propTypes = {
    selectedImg: PropTypes.string,
    setSelectedImg: PropTypes.func.isRequired,
};

export default ModalImg;
