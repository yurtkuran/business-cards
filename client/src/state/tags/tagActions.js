import axios from 'axios';

// bring in types
import { GET_TAGS, UPDATE_TAGS, SET_CURRENT_TAG, CLEAR_CURRENT_TAG, REMOVE_TAG } from '../types';

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
        dispatch({ type: GET_TAGS, payload: res.data });
    } catch (err) {
        console.log(err);
    }
};

// get all tags, determine count
export const getTagsWithCount = () => async (dispatch) => {
    try {
        const cards = await axios.get(`/api/bcards/`);

        const tagResponse = await axios.get(`/api/tags/`);
        let tags = tagResponse.data;

        // determine count for each tag
        cards.data.forEach((card) => {
            // destructure
            const { tags: cardTags } = card;

            cardTags.forEach((cardTag) => {
                const tagIndex = tags.findIndex((tagItem) => tagItem.name === cardTag);

                if (tagIndex > -1) {
                    if (!('count' in tags[tagIndex])) {
                        tags[tagIndex] = { ...tags[tagIndex], count: 1 };
                    } else {
                        tags[tagIndex] = { ...tags[tagIndex], count: tags[tagIndex].count + 1 };
                    }
                }
            });
        });

        // sort tags alphabetically
        tags.sort((a, b) => (a.name.toUpperCase() < b.name.toUpperCase() ? -1 : a.name.toUpperCase() > b.name.toUpperCase() ? 1 : 0));

        dispatch({ type: GET_TAGS, payload: tags });
    } catch (err) {
        console.error(err);
    }
};

// updagte tags
export const updateTag = (_id, name) => (dispatch) => {
    try {
        dispatch({ type: UPDATE_TAGS, payload: { _id, name } });
        axios.post('/api/tags', { _id, name }, config);
    } catch (err) {
        console.error(err);
    }
};

// delete tag
export const deleteTag = (id) => async (dispatch) => {
    try {
        await axios.delete(`/api/tags/${id}`);
        dispatch({ type: REMOVE_TAG, payload: id });
    } catch (err) {
        console.error(err);
    }
};

// set current tag
export const setCurrent = (id) => (dispatch) => {
    dispatch({ type: SET_CURRENT_TAG, payload: id });
};

// clear current tag
export const clearCurrent = () => (dispatch) => {
    dispatch({ type: CLEAR_CURRENT_TAG });
};
