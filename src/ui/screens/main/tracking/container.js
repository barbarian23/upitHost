import { connect } from 'react-redux';
import TrackingScreen from './index';
import * as trackingAction from './trackingAction';
import { fetchRiding } from './trackingAction';

const mapStateToProps = (state) => ({
    fetchRidingLoading: state.trackingReducer.riding.loading,
    activeRides: state.trackingReducer.riding.data,
    fcmToken: state.accountReducer.fcmToken.token,
});

export const mapDispatchToProps = (dispatch) => ({
    fetchRiding: (callback) => {
        dispatch(fetchRiding(callback));
    },
    trackRide: (data, completeCallback) => dispatch(trackingAction.trackRide(data, completeCallback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TrackingScreen);
