import { Guid } from "guid-typescript";

export enum ImageType {
    Camera = 1,
    Gallery = 2
}

export interface Photo {
    id: Guid;
    imageUri: string;
    type: ImageType;
    labels: Guid[];
    longitude?: number;
    latitude?: number;
    createDate?: Date;
    country?: string;
    city?: string;
}

export interface PhotoState {
    photos: Photo[];
}

export const INIT_PHOTO_STATE = 'INIT_PHOTO_STATE';
export const ADD_PHOTO = 'ADD_PHOTO';
export const DELETE_PHOTO = 'DELETE_PHOTO';
export const ADD_LABEL_TO_PHOTO = 'ADD_LABEL_TO_PHOTO';
export const REMOVE_LABEL_FROM_PHOTO = 'REMOVE_LABEL_FROM_PHOTO';
export const REMOVE_LABEL_FROM_ALL_PHOTO = 'REMOVE_LABEL_FROM_ALL_PHOTO';

interface InitPhotoStateAction {
    type: typeof INIT_PHOTO_STATE,
    payload: PhotoState
}

interface AddPhotoAction {
    type: typeof ADD_PHOTO
    payload: Photo
}

interface DeletePhotoAction {
    type: typeof DELETE_PHOTO
    payload: {
        id: Guid
    }
}

interface AddLabelToPhotoAction {
    type: typeof ADD_LABEL_TO_PHOTO
    payload: {
        photoId: Guid
        labelId: Guid
    }
}

interface RemoveLabelFromPhotoAction {
    type: typeof REMOVE_LABEL_FROM_PHOTO
    payload: {
        photoId: Guid
        labelId: Guid
    }
}

interface RemoveLabelFromAllPhotoAction {
    type: typeof REMOVE_LABEL_FROM_ALL_PHOTO
    payload: {
        labelId: Guid
    }
}

export type PhotoActionTypes = InitPhotoStateAction
                             | AddPhotoAction
                             | DeletePhotoAction
                             | AddLabelToPhotoAction
                             | RemoveLabelFromPhotoAction
                             | RemoveLabelFromAllPhotoAction;
