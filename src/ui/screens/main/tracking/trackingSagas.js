import { put, takeLatest } from 'redux-saga/effects';
import { FETCH_RIDING, TRACK_RIDE } from './trackingAction';
import * as ApiTracking from '../../../../services/apis/ApiTracking';

function* fetchRiding(action) {
    const { callback } = action;
    try {
        yield put({ type: FETCH_RIDING.LOADING });
        const requestData = {
            status: 'riding',
        };
        const { data } = yield ApiTracking.fetchTripStatus(requestData);
        yield put({ type: FETCH_RIDING.SUCCESS, data });

        if (callback && typeof callback === 'function') {
            callback({ success: true });
        }
    } catch (error) {
        yield put({ type: FETCH_RIDING.ERROR, error });
        callback({ success: false, data: error });
    }
}

function* trackRide(action) {
    const { requestData, completeCallback } = action;

    try {
        yield put({ type: TRACK_RIDE.LOADING, completeCallback, tripId: requestData.tripId });
        const { data } = yield ApiTracking.requestListeningLocation(requestData);
        yield put({ type: TRACK_RIDE.SUCCESS, data });
    } catch (error) {
        yield put({ type: TRACK_RIDE.ERROR, error });
    }
}

export default function* watchTrackingData() {
    yield takeLatest(FETCH_RIDING.actionName, fetchRiding);
    yield takeLatest(TRACK_RIDE.actionName, trackRide);
}
