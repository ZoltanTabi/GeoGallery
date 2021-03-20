import {
    Photo,
    PhotoState,
    INIT_PHOTO_STATE,
    ADD_PHOTO,
    DELETE_PHOTO,
    ADD_LABEL_TO_PHOTO,
    REMOVE_LABEL_FROM_PHOTO,
    REMOVE_LABEL_FROM_ALL_PHOTO,
    PhotoActionTypes
} from '../../interfaces/photo';
import { Guid } from 'guid-typescript';
import { getData } from '../asyncStorage';
import { StateEnum } from '../../enums/stateEnum';
import { Dispatch } from 'redux';

/**
 * @description Don't use this action! Use initState.
 */
export function initPhotoState() {
    return (dispatch: Dispatch<any>) => {
        getData(StateEnum.photos)
            .then((result) => {
            dispatch(
                {
                    type: INIT_PHOTO_STATE,
                    payload: (result as PhotoState)
                }
            );
        });
    }
}

export function addPhotoFromGallery(photo: Photo): PhotoActionTypes {
    return {
        type: ADD_PHOTO,
        payload: photo
    }
}

export function addPhotoFromCamera(id: Guid, base64Encoded: string): PhotoActionTypes {
    throw('addPhotoFromCamera action is not implemented!');
    /*const newPhoto: Photo = {  };
    return {
        type: ADD_PHOTO,
        payload: newPhoto
    }*/
}

/**
 * @description Don't use this action! Use commonDeletePhoto.
 */
export function deletePhoto(id: Guid): PhotoActionTypes {
    return {
        type: DELETE_PHOTO,
        payload: {
            id: id
        }
    }
}

/**
 * @description Don't use this action! Use commonDeletePhoto.
 */
export function deletePhotoFromImageStore(id: Guid, uri: string) {
    throw('deletePhotoFromImageStore action is not implemented!');
    return (dispatch: Dispatch<any>) => {
        // GetData change to delete from ImageStore
        getData(StateEnum.labels)
            .then((result) => {
            dispatch(deletePhoto(id));
        });
    }
}

/**
 * @description Don't use this action! Use commonAddLabelToPhoto.
 */
export function addLabelToPhoto(photoId: Guid, labelId: Guid): PhotoActionTypes {
    return {
        type: ADD_LABEL_TO_PHOTO,
        payload: {
            photoId: photoId,
            labelId: labelId
        }
    }
}

/**
 * @description Don't use this action! Use commonRemoveLabelFromPhoto.
 */
export function removeLabelFromPhoto(photoId: Guid, labelId: Guid): PhotoActionTypes {
    return {
        type: REMOVE_LABEL_FROM_PHOTO,
        payload: {
            photoId: photoId,
            labelId: labelId
        }
    }
}

/**
 * @description Don't use this action! Use commonDeleteLabel.
 */
export function removeLabelFromAllPhoto(labelId: Guid): PhotoActionTypes {
    return {
        type: REMOVE_LABEL_FROM_ALL_PHOTO,
        payload: {
            labelId: labelId
        }
    }
}
