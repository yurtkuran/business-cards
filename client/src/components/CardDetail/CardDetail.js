//
// references:
// Store image in MongoDB and show it in React.js
// https://stackoverflow.com/questions/56200446/store-image-in-mongodb-and-show-it-in-react-js
//

// bring in dependencies
import PropTypes from 'prop-types';

// bring in redux
import { connect } from 'react-redux';

// bring in components

// bring in actions

// bring in functions and hooks
import useFetch from '../../hooks/useFetch';

// set initial state

// card image component
const CardImage = ({ image, setSelectedImg }) => {
    // const baseURL = `https://res.cloudinary.com/di6gb7c7s/image/upload/c_scale,w_300/`;

    // destructure
    const {
        side,
        image: { url },
    } = image;

    return (
        <div className='image' onClick={() => setSelectedImg(url)}>
            <h4>{`${side}`}</h4>
            <img className='mt-0' src={`${url}`} alt='' />
        </div>
    );
};

// tag componen
const Tag = ({ tag }) => {
    return <h4 className='bg-dark-light-6'>{tag}</h4>;
};

const CardDetail = ({ data, setSelectedImg }) => {
    // destructure data object
    const { _id, firstName, lastName, company, comment } = data;

    // load card
    const { data: cardData, isLoading } = useFetch(`/api/bcards/findOne/${_id}`);

    return (
        <>
            {!isLoading && (
                <>
                    <p>{`${firstName} ${lastName}`}</p>
                    <p>{`${company}`}</p>
                    {comment !== '' && <div className='mt-2 bg-dark-light-8 p-2 rounded'>{comment}</div>}
                    <div className='card-detail-images mt-3'>
                        {cardData.images
                            .sort((a, b) => {
                                return a.side > b.side ? -1 : a.side < b.side ? 1 : 0; // sort in reverse alpha order, i.e. "front, back"
                            })
                            .map((image) => (
                                <CardImage key={image.side} image={image} setSelectedImg={setSelectedImg} />
                            ))}
                    </div>
                    <div className='card-detail-tags mt-2'>
                        {cardData.tags &&
                            cardData.tags.length > 0 &&
                            cardData.tags
                                .sort((a, b) => {
                                    return a.side < b.side ? -1 : a.side > b.side ? 1 : 0;
                                })
                                .map((tag, idx) => <Tag key={idx} tag={tag} />)}
                    </div>
                </>
            )}
        </>
    );
};

CardDetail.propTypes = {
    data: PropTypes.object.isRequired,
    setSelectedImg: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CardDetail);
