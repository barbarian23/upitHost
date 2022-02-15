import { FETCH_CURRENT_DEPT, FETCH_DEPT_LIST } from './profileActions';
import { LOGOUT } from '../../../../actions/commonActions';

export const initialState = {
    deptList: [],
    isLoadingDeptList: false,
    errorDeptList: '',

    sum: 0,
    moneyKeeped: 0,
    is_complete: false,
    isLoadingCurrentDept: false,

};

const profileReducer = (state = initialState, { payload, type } = {}) => {
    switch (type) {
        case LOGOUT:
            return {
                ...initialState,
            };

        case FETCH_DEPT_LIST.LOADING:
            return {
                ...state,
                isLoadingDeptList: true,
            };

        case FETCH_DEPT_LIST.SUCCESS:
            payload.sort((a, b) => ((a.from_time > b.from_time) ? -1 : ((b.from_time > a.from_time) ? 1 : 0)));
            return {
                ...state,
                deptList: payload,
                isLoadingDeptList: false,
            };

        case FETCH_DEPT_LIST.ERROR:
            return {
                ...state,
                errorDeptList: payload,
                isLoadingDeptList: false,
            };

        case FETCH_CURRENT_DEPT.LOADING:
            return {
                ...state,
                isLoadingCurrentDept: true,
            };

        case FETCH_CURRENT_DEPT.SUCCESS:
            return {
                ...state,
                sum: payload.sum,
                moneyKeeped: payload.moneyKeeped,
                is_complete: payload.is_complete,
                isLoadingCurrentDept: false,
            };

        case FETCH_CURRENT_DEPT.ERROR:
            return {
                ...state,
                isLoadingCurrentDept: false,
            };
        default:
            return state;
    }
};

export default profileReducer;
