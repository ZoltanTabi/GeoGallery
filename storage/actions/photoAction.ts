import {
    Photo,
    PhotoState,
    INIT_PHOTO_STATE,
    ADD_PHOTO,
    ADD_MULTIPLE_PHOTO,
    DELETE_PHOTO,
    ADD_LABEL_TO_PHOTO,
    REMOVE_LABEL_FROM_PHOTO,
    REMOVE_LABEL_FROM_ALL_PHOTO,
    PhotoActionTypes,
    InitPhoto
} from '../../interfaces/photo';
import { getData } from '../asyncStorage';
import { StateEnum } from '../../enums/stateEnum';
import { Dispatch } from 'redux';
import { initPhotoToPhoto } from '../../helpers/functions';
import { Platform } from 'react-native';
var RNFS = require('react-native-fs');

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

export function addPhoto(initPhoto: InitPhoto) {
    return (dispatch: Dispatch<any>) => {
        const path = (Platform.OS === 'ios' ? '' : 'file://') + RNFS.DocumentDirectoryPath + `/${initPhoto.id}.${initPhoto.extension}`;

        RNFS.writeFile(path, initPhoto.base64Encoded, 'base64')
        .then(() => {
            dispatch(
                {
                    type: ADD_PHOTO,
                    payload: initPhotoToPhoto(initPhoto, path)
                }
            );
        })
        .catch((err: any) => {
            console.log(err.message);
        });
    }
}

export function addMultiplePhoto(initPhotos: InitPhoto[]) {
    return async (dispatch: Dispatch<any>) => {
        const photos: Photo[] = [];
        const imageSaves: any[] = [];

        initPhotos.forEach(x => {
            try {
                const path = (Platform.OS === 'ios' ? '' : 'file://') + RNFS.DocumentDirectoryPath + `/${x.id}.${x.extension}`;
                imageSaves.push(RNFS.writeFile(path, x.base64Encoded, 'base64'));
                photos.push(initPhotoToPhoto(x, path));
            }
            catch(err) {
                console.error(err);
            }
        })
        
        await Promise.all(imageSaves);

        dispatch(
            {
                type: ADD_MULTIPLE_PHOTO,
                payload: photos
            }
        );
    }
}

/**
 * @description Don't use this action! Use commonDeletePhoto.
 */
export function deletePhoto(id: string, uri: string) {

    return (dispatch: Dispatch<any>) => {
        RNFS.unlink(uri)
        .then(() => {
            dispatch(
                {
                    type: DELETE_PHOTO,
                    payload: {
                        id: id
                    }
                }
            );
        })
        .catch((err: any) => {
            console.log(err.message);
        });
    }
}

/**
 * @description Don't use this action! Use commonAddLabelToPhoto.
 */
export function addLabelToPhoto(photoId: string, labelId: string): PhotoActionTypes {
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
export function removeLabelFromPhoto(photoId: string, labelId: string): PhotoActionTypes {
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
export function removeLabelFromAllPhoto(labelId: string): PhotoActionTypes {
    return {
        type: REMOVE_LABEL_FROM_ALL_PHOTO,
        payload: {
            labelId: labelId
        }
    }
}
