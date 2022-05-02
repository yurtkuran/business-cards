import axios from 'axios';

// bring in types
import { GET_CARDS, SET_CURRENT_CARD, CLEAR_CURRENT_CARD, REMOVE_CARD } from '../types';

// axios header
const config = {
    headers: {
        'Content-Type': 'application/json',
    },
};

// get all cards
export const getCards = () => async (dispatch) => {
    try {
        const res = await axios.get(`/api/bcards/`);
        dispatch({ type: GET_CARDS, payload: res.data });
    } catch (err) {
        console.log(err);
    }
};

// add or update card
export const addOrUpdateCard = (formData, navigate) => async (dispatch) => {
    try {
        await axios.post('/api/bcards', formData, config);

        navigate('/'); // redirect
    } catch (err) {
        console.log(err);
    }
};

// delete card
export const deleteCard = (id) => async (dispatch) => {
    try {
        await axios.delete(`/api/bcards/${id}`);
        dispatch({ type: REMOVE_CARD, payload: id });
    } catch (err) {
        console.error(err);
    }
};

// set current card
export const setCurrent = (id) => (dispatch) => {
    dispatch({ type: SET_CURRENT_CARD, payload: id });
};

// clear current card
export const clearCurrent = () => (dispatch) => {
    dispatch({ type: CLEAR_CURRENT_CARD });
};
