   /* eslint-disable */
   import { combineReducers } from 'redux';
    import { CHANGE_CATEGORY, CHANGE_REGION, MAX_VIDEOS_TO_LOAD } from '../actionTypes';

    const initialState = {
        region: null,
        categoryID: null,
        maxVideosToLoad: null
    };
    function reducer( state = initialState, action) {
        switch(action.type) {
            case CHANGE_REGION:
                return {
                    ...state,
                    region: action.data.region
                };
            case CHANGE_CATEGORY:
                return {
                    ...state,
                    categoryID: action.data.categoryID
                };
            case MAX_VIDEOS_TO_LOAD:
                return {
                    ...state,
                    maxVideosToLoad:action.data.maxVideosToLoad
                };
            default:
                return state;
        }

    }
    const reducers = combineReducers({reducer});
    export default reducers;