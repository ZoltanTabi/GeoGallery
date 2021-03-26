
export interface Label {
    id: string;
    text: string;
    color: string;
    photos: string[];
}

export interface LabelState {
    labels: Label[];
}

export const INIT_LABEL_STATE = 'INIT_LABEL_STATE';
export const ADD_LABEL = 'ADD_LABEL';
export const UPDATE_LABEL = 'UPDATE_LABEL';
export const DELETE_LABEL = 'DELETE_LABEL';
export const ADD_PHOTO_TO_LABEL = 'ADD_PHOTO_TO_LABEL';
export const REMOVE_PHOTO_FROM_LABEL = 'REMOVE_PHOTO_FROM_LABEL';
export const REMOVE_PHOTO_FROM_ALL_LABEL = 'REMOVE_PHOTO_FROM_ALL_LABEL';

interface InitLabelStateAction {
    type: typeof INIT_LABEL_STATE
    payload: LabelState
}

interface AddLabelAction {
    type: typeof ADD_LABEL
    payload: Label
}

interface UpdateLabelAction {
    type: typeof UPDATE_LABEL
    payload: Label
}

interface DeleteLabelAction {
    type: typeof DELETE_LABEL
    payload: {
        id: string
    }
}

interface AddPhotoToLabelAction {
    type: typeof ADD_PHOTO_TO_LABEL
    payload: {
        photoId: string
        labelId: string
    }
}

interface RemovePhotoFromLabelAction {
    type: typeof REMOVE_PHOTO_FROM_LABEL
    payload: {
        photoId: string
        labelId: string
    }
}

interface RemovePhotoFromAllLabelAction {
    type: typeof REMOVE_PHOTO_FROM_ALL_LABEL
    payload: {
        photoId: string
    }
}

export type LabelActionTypes = InitLabelStateAction
                             | AddLabelAction
                             | UpdateLabelAction
                             | DeleteLabelAction
                             | AddPhotoToLabelAction
                             | RemovePhotoFromLabelAction
                             | RemovePhotoFromAllLabelAction;
