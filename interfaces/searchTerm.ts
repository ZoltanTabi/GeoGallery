import { MapCircleProps, LatLng } from 'react-native-maps';

export interface SearchTerm {
    countries: string[];
    cities: string[];
    dateTo?: Date;
    dateFrom?: Date;
    labels: string[];
    circle?: MapCircleProps;
    polygon?: LatLng[];
    photoIdsByClusterFilter?: string[];
}

export interface SearchTermState {
    searchTerm: SearchTerm;
}

export const UPDATE_SEARCH_TERM = 'UPDATE_SEARCH_TERM';
export const REMOVE_LABEL = 'REMOVE_LABEL';

interface UpdateSearchTermStateAction {
    type: typeof UPDATE_SEARCH_TERM,
    payload: SearchTerm
}

interface RemoveLabelAction {
    type: typeof REMOVE_LABEL
    payload: string
}


export type SearchTermTypes = UpdateSearchTermStateAction
                            | RemoveLabelAction;
