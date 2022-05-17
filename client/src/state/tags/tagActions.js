import axios from 'axios';

// bring in types
import { GET_TAGS } from '../types';

// axios header
const config = {
    headers: {
        'Content-Type': 'application/json',
    },
};

// get all tags
export const getTags = () => async (dispatch) => {
    try {
        const res = await axios.get(`/api/tags/`);
        const tagList = res.data.map((tag, idx) => ({
            id: idx,
            name: tag,
        }));
        dispatch({ type: GET_TAGS, payload: tagList });
    } catch (err) {
        console.log(err);
    }
};
