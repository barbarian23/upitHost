import { connect } from 'react-redux';
import { getProfile, requestFetchHouseList } from '../../../../actions/accountActions';
import ProfileScreen from './index';
import { fetchCurrentDept, fetchDeptList } from './profileActions';
import { doLogout } from '../../../../actions/commonActions';

const mapStateToProps = (state) => ({
    profile: state.accountReducer.profile.data,
    profileLoading: state.accountReducer.profile.loading,
    sum: state.profileReducer.sum,
    moneyKeeped: state.profileReducer.moneyKeeped,
    is_complete: state.profileReducer.is_complete,

    deptList: state.profileReducer.deptList,
    isLoadingDeptList: state.profileReducer.isLoadingDeptList,

    isLoadingCurrentDept: state.profileReducer.isLoadingCurrentDept,
    houseList: state.accountReducer.houseList.data,
    fetchHouseListLoading: state.accountReducer.houseList.loading,
});

export const mapDispatchToProps = (dispatch) => ({
    getProfile: () => {
        dispatch(getProfile());
    },
    fetchCurrentDept: () => {
        dispatch(fetchCurrentDept());
    },
    fetchDeptList: () => {
        dispatch(fetchDeptList());
    },
    fetchHouseList: () => {
        dispatch(requestFetchHouseList());
    },
    logout: () => {
        dispatch(doLogout());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
