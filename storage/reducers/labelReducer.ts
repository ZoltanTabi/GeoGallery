import { StateEnum } from '../../enums/stateEnum';
import { findIndexById } from '../../helpers/functions';
import {
    LabelState,
    INIT_LABEL_STATE,
    ADD_LABEL,
    UPDATE_LABEL,
    DELETE_LABEL,
    ADD_PHOTO_TO_LABEL,
    REMOVE_PHOTO_FROM_LABEL,
    REMOVE_PHOTO_FROM_ALL_LABEL,
    LabelActionTypes
} from '../../interfaces/label';
import { storeData } from '../asyncStorage';

const initialState: LabelState = {
    labels: []
}

export function labelReducer(state = initialState, action: LabelActionTypes): LabelState {
    switch (action.type) {
        case INIT_LABEL_STATE:
        {
            if (action.payload === null ) {
                return state;
            }
            return action.payload;
        }
        case ADD_LABEL:
        {
            state.labels.push(action.payload);
            storeLabelState(state);

            return {
                labels: [...state.labels]
            };
        }
        case UPDATE_LABEL:
        {
            state.labels[findIndexById(state.labels, action.payload.id)] = action.payload;
            storeLabelState(state);

            return {
                labels: [...state.labels]
            };
        }
        case DELETE_LABEL:
        {
            const newState: LabelState = {
                labels: state.labels.filter(
                    label => label.id !== action.payload.id
                )
            };

            storeLabelState(newState);

            return newState;
        }
        case ADD_PHOTO_TO_LABEL:
        {
            state.labels[findIndexById(state.labels, action.payload.labelId)].photos.push(action.payload.photoId);
            storeLabelState(state);

            return {
                labels: [...state.labels]
            };
        }
        case REMOVE_PHOTO_FROM_LABEL:
        {
            const index = findIndexById(state.labels, action.payload.labelId);
            state.labels[index].photos = state.labels[index].photos.filter(x => x !== action.payload.photoId);
            storeLabelState(state);

            return {
                labels: [...state.labels]
            };
        }
        case REMOVE_PHOTO_FROM_ALL_LABEL:
        {
            state.labels.forEach(x => {
                x.photos = x.photos.filter(y => y !== action.payload.photoId);
            });
            storeLabelState(state);

            return {
                labels: [...state.labels]
            };
        }
        default:
            return state;
    }
}

function storeLabelState(state: LabelState) {
    storeData(state, StateEnum.labels);
}
