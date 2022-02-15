import { connect } from 'react-redux';
import BookingScreen from './index';
import { getProfile } from '../../../../actions/accountActions';

const mapStateToProps = (state) => ({
    profile: state.accountReducer.profile.data,
    profileLoading: state.accountReducer.profile.loading,
});

export const mapDispatchToProps = (dispatch) => ({
    getProfile: () => {
        dispatch(getProfile());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingScreen);
