import { EDIT_PROFILE, GET_HOUSE_LIST, GET_PROFILE } from '../actions/accountActions';
import { LOGOUT } from '../actions/commonActions';

export const initState = {
    action: '',
    profile: {
        loading: false,
        data: null,
    },
    houseList: {
        loading: false,
        data: null,
    },
    fcmToken: {
        token: '',
    },
};

export const accountReducer = (state = initState, { type, data, success } = {}) => {
    let newState = { ...state };
    newState.action = type;
    switch (type) {
        case LOGOUT: {
            return {
                ...initState,
            };
        }
        case 'STORE_FIREBASE_TOKEN': {
            newState = {
                ...newState,
                fcmToken: {
                    token: data,
                },
            };
            return newState;
        }
        case GET_PROFILE.LOADING: {
            newState.profile.loading = true;

            return newState;
        }
        case GET_PROFILE.SUCCESS: {
            return {
                ...newState,
                profile: {
                    loading: false,
                    data: data.salepoint,
                },
            };
        }
        case GET_PROFILE.ERROR: {
            return {
                newState,
                profile: {
                    ...newState.profile,
                    loading: false,
                },
            };
        }
        case GET_HOUSE_LIST.LOADING: {
            return {
                ...newState,
                houseList: {
                    loading: true,
                    data: null,
                },
            };
        }
        case GET_HOUSE_LIST.SUCCESS: {
            newState.houseList.loading = false;
            newState.houseList.data = data.data;

            return {
                ...newState,
                houseList: {
                    loading: false,
                    data: data.data,
                },
            };
        }
        case GET_HOUSE_LIST.ERROR: {
            newState.houseList.loading = false;

            return newState;
        }
        case EDIT_PROFILE.LOADING: {
            let { profile } = newState;
            newState = {
                ...newState,
                profile: {
                    ...profile,
                    loading: true,
                },
            };
            return newState;
        }
        case EDIT_PROFILE.SUCCESS: {
            let { profile } = newState;
            const hostData = { ...profile.data, ...data };
            newState = {
                ...newState,
                profile: {
                    ...newState.profile,
                    data: hostData,
                    loading: false,
                },
            };
            success();
            return newState;
        }
        case EDIT_PROFILE.ERROR: {

            return newState;
        }
        default:
            return newState;
    }
};
