import {
    UPDATE_SEARCH_TERM,
    REMOVE_LABEL,
    SearchTermState,
    SearchTermTypes
} from '../../interfaces/searchTerm';

const initialState: SearchTermState = {
    searchTerm: { }
}

export function searchTermReducer(state = initialState, action: SearchTermTypes): SearchTermState {
    switch (action.type) {
        case UPDATE_SEARCH_TERM:
        {
            return { searchTerm: { ...action.payload } };
        }
        case REMOVE_LABEL:
        {
            state.searchTerm.labels = state.searchTerm.labels?.filter(x => x !== action.payload);

            return { ...state };
        }
        default:
            return state;
    }
}
