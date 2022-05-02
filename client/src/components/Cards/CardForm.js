// references
//
// https://stackoverflow.com/questions/52566331/formdata-append-nested-object

// bring in dependencies
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './cards.scss';

// bring in redux
import { connect } from 'react-redux';

// bring in components

// bring in actions
import { addOrUpdateCard } from '../../state/cards/cardActions';

// bring in functions and hooks

// set initial state
const initialFormState = {
    firstName: '',
    lastName: '',
    company: '',
    tags: '',
    comment: '',
};

const initialFileState = {
    front: '',
    back: '',
};

const ImageField = ({ mode, side, previewSource, label, file, setPreviewSource, setFileInput, handleFileInputChange }) => {
    const handleClick = () => {
        setPreviewSource((prevPreviews) => {
            return { ...prevPreviews, [side]: '' };
        });
        setFileInput((prevFiles) => {
            return { ...prevFiles, [side]: '' };
        });
    };

    return (
        <>
            {previewSource && (
                <button type='button' className='btn-outline-primary btn-md mr-3 text-center' onClick={handleClick}>
                    <i className={`fa fa-times-circle`}></i> Remove {label}
                </button>
            )}
            {!previewSource && (
                <label htmlFor={`${side}-upload`} className='btn-outline-primary btn-md text-primary mr-3 text-center'>
                    <i className={`fa fa-cloud-upload`}></i> Add {label}
                </label>
            )}
            <div>
                <input id={`${side}-upload`} name={side} type='file' onChange={handleFileInputChange} value={file} />
                {file && <p>{file.substring(file.lastIndexOf('\\') + 1)}</p>}
                {previewSource && <img src={previewSource} alt='chosen' style={{ width: '250px' }} />}
            </div>
        </>
    );
};

const Home = ({ card: { current }, addOrUpdateCard }) => {
    const types = ['image/png', 'image/jpeg'];

    // setup useNavigate hook
    const navigate = useNavigate();

    // init local form state
    const [mode, setMode] = useState('add');
    const [formData, setFormData] = useState(initialFormState);
    const [fileInput, setFileInput] = useState(initialFileState);
    const [previewSource, setPreviewSource] = useState({});

    // set-up form data
    useEffect(() => {
        if (current) {
            setMode('edit');
            const tagList = current.tags.join(', ');
            setFormData({ ...current, tags: tagList });

            // load images
            const { images } = current;
            images.map((image) => {
                setPreviewSource((prevPreviews) => {
                    return { ...prevPreviews, [image.side]: image.image.url };
                });
            });
        }
    }, [current]);

    // on change handler
    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // on change image handler
    const handleFileInputChange = (e) => {
        const file = e.target.files[0];

        if (file && types.includes(file.type)) {
            // console.log(file);
            previewFile(e.target.name, file);
            setFileInput({ ...fileInput, [e.target.name]: e.target.value });
        } else {
            setFileInput({ ...fileInput, [e.target.name]: '' });
            setPreviewSource({ ...previewSource, [e.target.name]: '' });
        }
    };
    const previewFile = (name, file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource({ ...previewSource, [name]: reader.result });
        };
    };

    // destructure fields
    const { firstName, lastName, company, tags, comment } = formData;
    const { front, back } = fileInput;

    // on submit handler
    const onSubmit = async (e) => {
        e.preventDefault();

        // validate form before submitting
        let isFormValid = true;

        let data = {};
        data = new FormData(e.target);

        if (current) {
            // update existing card, append _id to formData
            data.append('_id', formData._id);

            // is image removed from card? loop through preview source, compare if preview does not exist in FE but URL exists in BE, imaged removed by user
            for (const side in previewSource) {
                // console.log(`${side} card attached: ${previewSource[side] ? 'yes' : 'no'}`);
                const image = {
                    side,
                    exists: previewSource[side] ? true : false,
                };
                data.append(`imageAttacted[]`, JSON.stringify(image));
            }
        }
        if (isFormValid) addOrUpdateCard(data, navigate);
    };

    return (
        <div className='form-wrapper'>
            <div className='card'>
                <h1 className='card-title'>Business Card</h1>
                <form onSubmit={onSubmit}>
                    <div className='row'>
                        <div className='col'>
                            <input className='form-control' type='text' onChange={onChange} name='firstName' value={firstName} />
                            <label className='mb-0'>First</label>
                        </div>

                        <div className='col'>
                            <input className='form-control' type='text' onChange={onChange} name='lastName' value={lastName} />
                            <label className='mb-0'>Last</label>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col'>
                            <input className='form-control' type='text' onChange={onChange} name='company' value={company} />
                            <label className='mb-0'>Company</label>
                        </div>
                    </div>

                    <div className='row mt-0'>
                        <div className='col'>
                            <input className='form-control' type='text' onChange={onChange} name='tags' value={tags} />
                            <label className='mb-0'>Tags</label>
                        </div>
                    </div>

                    <div className='row mb-1'>
                        <div className='col'>
                            <textarea className='form-control' rows='5' onChange={onChange} name='comment' value={comment}></textarea>
                            <label className='mb-0'>Comment</label>
                        </div>
                    </div>

                    <div className='row mb-1'>
                        <div className='col'>
                            <ImageField
                                mode={mode}
                                side={'front'}
                                label={'Front'}
                                previewSource={previewSource.front}
                                file={front}
                                setPreviewSource={setPreviewSource}
                                setFileInput={setFileInput}
                                handleFileInputChange={handleFileInputChange}
                            />
                        </div>

                        <div className='col'>
                            <ImageField
                                mode={mode}
                                side={'back'}
                                label={'Back'}
                                previewSource={previewSource.back}
                                file={back}
                                setPreviewSource={setPreviewSource}
                                setFileInput={setFileInput}
                                handleFileInputChange={handleFileInputChange}
                            />
                        </div>
                    </div>

                    <div className='row justify-content-end form-buttons'>
                        <Link to={'/'} className='btn-outline-primary text-primary mr-3 text-center'>
                            <i className='fa fa-list-alt mr-1'></i>View All
                        </Link>

                        <button className='btn-primary text-white mr-3'>
                            <i className='fa fa-database mr-3'></i>Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

Home.propTypes = {
    card: PropTypes.object.isRequired,
    addOrUpdateCard: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ card: state.card });

const mapDispatchToProps = { addOrUpdateCard };

export default connect(mapStateToProps, mapDispatchToProps)(Home);
