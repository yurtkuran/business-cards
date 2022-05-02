// root reducer
import { combineReducers } from 'redux';

// bring in reducers
import cardReducer from './cards/cardReducer';

export default combineReducers({
    card: cardReducer,
});
