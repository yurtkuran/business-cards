// bring in types
import { GET_CARDS, SET_CURRENT_CARD, CLEAR_CURRENT_CARD, REMOVE_CARD } from '../types';

const initialState = {
    cards: [],
    loading: true,
    current: null,
};

const card = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case GET_CARDS:
            return {
                ...state,
                cards: payload,
                loading: false,
            };

        case SET_CURRENT_CARD:
            return {
                ...state,
                current: state.cards.filter((card) => card._id === payload)[0],
            };

        case CLEAR_CURRENT_CARD:
            return {
                ...state,
                current: null,
                loading: false,
            };

        case REMOVE_CARD:
            return {
                ...state,
                cards: state.cards.filter((card) => card._id !== payload),
            };

        default:
            return state;
    }
};

export default card;
