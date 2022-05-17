// bring in types
import { GET_TAGS } from '../types';

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

        default:
            return state;
    }
};

export default tag;
