import { COMPLETE_LOGOUT, LOGOUT } from '../actions/commonActions';

export const initialState = {
    logout: {
        doLogout: false,
    },
};

export const commonReducer = (state = initialState, action = {}) => {
    let newState = { ...state };
    newState.action = action.type;
    switch (action.type) {
        case LOGOUT: {
            newState.doLogout = {
                doLogout: true,
            };
        }
            return newState;

        case COMPLETE_LOGOUT: {
            newState.doLogout = {
                doLogout: false,
            };
        }
            return newState;

        default:
            return state;
    }
};
