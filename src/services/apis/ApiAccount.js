import { Constants } from '../../commons';
import ApiHelper from './ApiHelper';

export const signIn = (data) => ApiHelper.post(Constants.SIGN_IN_PATH, data);

export const getHouseList = () => ApiHelper.post(Constants.GET_HOUSE_LIST_PATH);

export const editProfile = (data) => ApiHelper.post(Constants.EDIT_INFO, data);

export const getProfile = () => ApiHelper.get(Constants.GET_INFO);

export const uploadAvatar = (data) => {
    let config = {
        headers: {
            content_type: 'application/x-www-form-urlencoded',
        },
    };

    return ApiHelper.post(Constants.UPLOAD_AVATAR, data, config);
};

export const logout = () => ApiHelper.post(Constants.LOGOUT);
