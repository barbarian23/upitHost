import { createActionSet } from './index';

export const GET_PROFILE = createActionSet('GET_PROFILE');
export const GET_HOUSE_LIST = createActionSet('GET_HOUSE_LIST');
export const EDIT_PROFILE = createActionSet('EDIT_PROFILE');

export const getProfile = () => ({
    type: GET_PROFILE.actionName,
});

export const requestFetchHouseList = () => ({
    type: GET_HOUSE_LIST.actionName,
});

export const storeFirebaseToken = (token) => ({
    type: 'STORE_FIREBASE_TOKEN',
    data: token,
});

export const editProfile = (data, success) => ({
    type: EDIT_PROFILE.actionName,
    data,
    success,
});
