
export enum ImageType {
    Camera = 1,
    Gallery = 2
}

export interface PhotoForAdd {
    photo: Photo;
    extension: string;
    base64Encoded: string;
}

export interface Photo {
    id: string;
    imageUri: string;
    type: ImageType;
    labels: string[];
    width: number;
    height: number;
    longitude?: number;
    latitude?: number;
    createDate?: Date;
    address?: string;
    country?: string;
    city?: string;
}

export interface PhotoState {
    photos: Photo[];
}

export const INIT_PHOTO_STATE = 'INIT_PHOTO_STATE';
export const ADD_PHOTO = 'ADD_PHOTO';
export const ADD_MULTIPLE_PHOTO = 'ADD_MULTIPLE_PHOTO';
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

interface AddMultiplePhotoAction {
    type: typeof ADD_MULTIPLE_PHOTO
    payload: Photo[]
}

interface DeletePhotoAction {
    type: typeof DELETE_PHOTO
    payload: {
        id: string
    }
}

interface AddLabelToPhotoAction {
    type: typeof ADD_LABEL_TO_PHOTO
    payload: {
        photoId: string
        labelId: string
    }
}

interface RemoveLabelFromPhotoAction {
    type: typeof REMOVE_LABEL_FROM_PHOTO
    payload: {
        photoId: string
        labelId: string
    }
}

interface RemoveLabelFromAllPhotoAction {
    type: typeof REMOVE_LABEL_FROM_ALL_PHOTO
    payload: {
        labelId: string
    }
}

export type PhotoActionTypes = InitPhotoStateAction
                             | AddPhotoAction
                             | AddMultiplePhotoAction
                             | DeletePhotoAction
                             | AddLabelToPhotoAction
                             | RemoveLabelFromPhotoAction
                             | RemoveLabelFromAllPhotoAction;
