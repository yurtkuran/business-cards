// bring in types
import { GET_TAGS, UPDATE_TAGS, SET_CURRENT_TAG, CLEAR_CURRENT_TAG, REMOVE_TAG } from '../types';

const initialState = {
    tags: [],
    loading: true,
    current: null,
};

const tag = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case GET_TAGS:
            return {
                ...state,
                tags: payload,
                loading: false,
            };

        case UPDATE_TAGS:
            const { _id, name } = payload;
            return {
                ...state,
                tags: state.tags.map((tag) => (tag._id === _id ? { ...tag, name } : tag)),
            };

        case SET_CURRENT_TAG:
            return {
                ...state,
                current: state.tags.filter((tag) => tag._id === payload)[0],
            };

        case CLEAR_CURRENT_TAG:
            return {
                ...state,
                current: null,
                loading: false,
            };

        case REMOVE_TAG:
            return {
                ...state,
                tags: state.tags.filter((tag) => tag._id !== payload),
            };

        default:
            return state;
    }
};

export default tag;
