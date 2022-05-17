// root reducer
import { combineReducers } from 'redux';

// bring in reducers
import cardReducer from './cards/cardReducer';
import tagReducer from './tags/tagReducer';

export default combineReducers({
    card: cardReducer,
    tag: tagReducer,
});
