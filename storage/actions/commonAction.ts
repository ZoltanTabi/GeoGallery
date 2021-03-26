import { Dispatch } from "redux";
import { ImageType, Photo } from "../../interfaces/photo";
import {
    deleteLabel,
    initLabelState,
    addPhotoToLabel,
    removePhotoFromLabel,
    removePhotoFromAllLabel
} from "./labelAction";
import {
    initPhotoState,
    removeLabelFromAllPhoto,
    addLabelToPhoto,
    removeLabelFromPhoto,
    deletePhotoFromImageStore,
    deletePhoto
} from "./photoAction";

export function initState() {
    return (dispatch: Dispatch<any>) => {
        dispatch(initLabelState());
        dispatch(initPhotoState());
    }
}

export function commonDeletePhoto(photo: Photo) {
    return (dispatch: Dispatch<any>) => {
        if (photo.type === ImageType.Camera) {
            dispatch(deletePhotoFromImageStore(photo.id, photo.imageUri));
        } else {
            dispatch(deletePhoto(photo.id));
        }
        dispatch(removePhotoFromAllLabel(photo.id));
    }
}

export function commonDeleteLabel(labelId: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch(deleteLabel(labelId));
        dispatch(removeLabelFromAllPhoto(labelId));
    }
}

export function commonAddLabelToPhoto(photoId: string, labelId: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch(addPhotoToLabel(photoId, labelId));
        dispatch(addLabelToPhoto(photoId, labelId));
    }
}

export function commonRemoveLabelFromPhoto(photoId: string, labelId: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch(removePhotoFromLabel(photoId, labelId));
        dispatch(removeLabelFromPhoto(photoId, labelId));
    }
}
