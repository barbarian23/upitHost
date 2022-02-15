import { put, takeLatest } from 'redux-saga/effects';
import { FETCH_ASSIGN, FETCH_BOOKING, FETCH_COMPLETED } from './statusActions';
import { Constants } from '../../../../commons';
import * as ApiStatus from '../../../../services/apis/ApiStatus';

const dataStatus = (dataType) => {
    switch (dataType) {
        case Constants.STATUS_BOOKING:
            return { requestData: { status: 'create' }, type: FETCH_BOOKING };
        case Constants.STATUS_CONFIRM:
            return { requestData: { status: 'accept' }, type: FETCH_ASSIGN };
        default:
        case Constants.STATUS_COMPLETE:
            return { requestData: { status: 'complete' }, type: FETCH_COMPLETED };
    }
};

function* fetchStatusData(action) {
    const { type, requestData } = dataStatus(action.dataType);
    try {
        yield put({ type: type.LOADING });
        let { data } = yield ApiStatus.fetchTripStatus(requestData);
        yield put({ type: type.SUCCESS, data, });
    } catch (e) {
        yield put({ type: type.ERROR, error: e.messages });
    }
}

function* watchStatusData() {
    yield takeLatest(FETCH_BOOKING.actionName, fetchStatusData);
    yield takeLatest(FETCH_ASSIGN.actionName, fetchStatusData);
    yield takeLatest(FETCH_COMPLETED.actionName, fetchStatusData);
}

export default watchStatusData;
