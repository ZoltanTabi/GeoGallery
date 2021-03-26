import { StateEnum } from '../../enums/stateEnum';
import { findIndexById } from '../../helpers/functions';
import {
    PhotoState,
    INIT_PHOTO_STATE,
    ADD_PHOTO,
    ADD_MULTIPLE_PHOTO,
    DELETE_PHOTO,
    ADD_LABEL_TO_PHOTO,
    REMOVE_LABEL_FROM_PHOTO,
    REMOVE_LABEL_FROM_ALL_PHOTO,
    PhotoActionTypes
} from '../../interfaces/photo';
import { storeData } from '../asyncStorage';

const initialState: PhotoState = {
    photos: []
}

export function photoReducer(state = initialState, action: PhotoActionTypes): PhotoState {
    switch (action.type) {
        case INIT_PHOTO_STATE:
        {
            if (action.payload === null ) {
                return state;
            }
            return action.payload;
        }
        case ADD_PHOTO:
        {
            state.photos.push(action.payload);
            storePhotoState(state);

            return {
                photos: state.photos
            };
        }
        case ADD_MULTIPLE_PHOTO:
        {
            state.photos.push(...action.payload);
            storePhotoState(state);

            return {
                photos: state.photos
            };
        }
        case DELETE_PHOTO:
        {
            const newState: PhotoState = {
                photos: state.photos.filter(
                    photo => photo.id !== action.payload.id
                )
            };

            storePhotoState(newState);

            return newState;
        }
        case ADD_LABEL_TO_PHOTO:
        {
            state.photos[findIndexById(state.photos, action.payload.photoId)].labels.push(action.payload.labelId);
            storePhotoState(state);

            return {
                photos: state.photos
            };
        }
        case REMOVE_LABEL_FROM_PHOTO:
        {
            const index = findIndexById(state.photos, action.payload.photoId);
            state.photos[index].labels = state.photos[index].labels.filter(x => x !== action.payload.labelId);
            storePhotoState(state);

            return {
                photos: state.photos
            };
        }
        case REMOVE_LABEL_FROM_ALL_PHOTO:
        {
            state.photos.forEach(x => {
                x.labels = x.labels.filter(y => y !== action.payload.labelId);
            });
            storePhotoState(state);

            return {
                photos: state.photos
            };
        }
        default:
            return state;
    }
}

function storePhotoState(state: PhotoState) {
    storeData(state, StateEnum.photos);
}
