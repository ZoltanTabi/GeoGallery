import {
    SearchTerm,
    UPDATE_SEARCH_TERM,
    REMOVE_LABEL,
    SearchTermTypes
} from '../../interfaces/searchTerm';

export function updateSearchTerm(searchTerm: SearchTerm): SearchTermTypes {
    return {
        type: UPDATE_SEARCH_TERM,
        payload: searchTerm
    };
}

/**
 * @description Don't use this action!
 */
export function removeLabel(labelId: string): SearchTermTypes {
    return {
        type: REMOVE_LABEL,
        payload: labelId
    }
}
