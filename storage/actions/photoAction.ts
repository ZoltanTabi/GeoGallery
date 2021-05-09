import {
    Photo,
    PhotoForAdd,
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
import { getData } from '../asyncStorage';
import { StateEnum } from '../../enums/stateEnum';
import { Dispatch } from 'redux';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { devConsoleLog } from '../../helpers/functions';

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

export function addPhoto(photoForAdd: PhotoForAdd) {
    return (dispatch: Dispatch<any>) => {
        const path = (Platform.OS === 'ios' ? '' : 'file://') + RNFS.DocumentDirectoryPath + `/${photoForAdd.photo.id}.${photoForAdd.extension}`;
        photoForAdd.photo.imageUri = path;

        RNFS.writeFile(path, photoForAdd.base64Encoded, 'base64')
        .then(() => {
            dispatch(
                {
                    type: ADD_PHOTO,
                    payload: photoForAdd.photo
                }
            );
        })
        .catch((err: any) => {
            devConsoleLog(err.message);
        });
    }
}

export function addMultiplePhoto(photoForAdds: PhotoForAdd[]) {
    return async (dispatch: Dispatch<any>) => {
        const photos: Photo[] = [];
        
        await Promise.all(photoForAdds.map(async x => {
            const path = (Platform.OS === 'ios' ? '' : 'file://') + RNFS.DocumentDirectoryPath + `/${x.photo.id}.${x.extension}`;
            x.photo.imageUri = path;
            photos.push(x.photo);
            await RNFS.writeFile(path, x.base64Encoded, 'base64');
        }));

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
            devConsoleLog(err.message);
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
