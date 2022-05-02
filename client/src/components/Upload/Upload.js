import { useState } from 'react';
import PropTypes from 'prop-types';

const Upload = (props) => {
    const [fileInputState, setFileInputState] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [selectedFile, setSelectedFile] = useState();

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        previewFile(file);
        setSelectedFile(file);
        setFileInputState(e.target.value);
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };

    const handleSubmitFile = (e) => {
        e.preventDefault();
        console.log(selectedFile);

        if (!previewSource) return;

        let data = new FormData();
        data.append('front', selectedFile);
        data.append('firstName', 'Bart');

        uploadImage(previewSource);
    };

    const uploadImage = async (data) => {
        try {
            await fetch('/api/bcards/uploadimage', {
                method: 'POST',
                body: JSON.stringify({ data }),
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Upload</h1>
            <form onSubmit={handleSubmitFile}>
                <input type='file' name='front' className='' onChange={handleFileInputChange} value={fileInputState} />
                <button className='btn' type='submit'>
                    Submit
                </button>
            </form>
            {previewSource && <img src={previewSource} alt='chosen' style={{ height: '200px' }} />}
        </div>
    );
};

Upload.propTypes = {};

export default Upload;
