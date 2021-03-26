import {
    Label,
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
import { Dispatch } from 'redux';
import { getData } from '../asyncStorage';
import { StateEnum } from '../../enums/stateEnum';

/**
 * @description Don't use this action! Use initState.
 */
export function initLabelState() {
    return (dispatch: Dispatch<any>) => {
        getData(StateEnum.labels)
            .then((result) => {
            dispatch(
                {
                    type: INIT_LABEL_STATE,
                    payload: (result as LabelState)
                }
            );
        });
    }
}

export function createLabel(newLabel: Label): LabelActionTypes {
    return {
        type: ADD_LABEL,
        payload: newLabel
    }
}

export function updateLabel(label: Label): LabelActionTypes {
    return {
        type: UPDATE_LABEL,
        payload: label
    }
}

/**
 * @description Don't use this action! Use commonDeleteLabel.
 */
export function deleteLabel(id: string): LabelActionTypes {
    return {
        type: DELETE_LABEL,
        payload: {
            id: id
        }
    }
}

/**
 * @description Don't use this action! Use commonAddLabelToPhoto.
 */
export function addPhotoToLabel(photoId: string, labelId: string): LabelActionTypes {
    return {
        type: ADD_PHOTO_TO_LABEL,
        payload: {
            photoId: photoId,
            labelId: labelId
        }
    }
}

/**
 * @description Don't use this action! Use commonRemoveLabelFromPhoto.
 */
export function removePhotoFromLabel(photoId: string, labelId: string): LabelActionTypes {
    return {
        type: REMOVE_PHOTO_FROM_LABEL,
        payload: {
            photoId: photoId,
            labelId: labelId
        }
    }
}

/**
 * @description Don't use this action! Use commonDeletePhoto.
 */
export function removePhotoFromAllLabel(photoId: string): LabelActionTypes {
    return {
        type: REMOVE_PHOTO_FROM_ALL_LABEL,
        payload: {
            photoId: photoId
        }
    }
}
