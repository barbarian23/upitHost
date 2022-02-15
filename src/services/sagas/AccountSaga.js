import { put, takeLatest } from 'redux-saga/effects';
import { EDIT_PROFILE, GET_HOUSE_LIST, GET_PROFILE } from '../../actions/accountActions';
import * as ApiAccount from '../apis/ApiAccount';
import { updateProfile } from '../apis/ApiProfile';

function* getProfile() {
    try {
        yield put({ type: GET_PROFILE.LOADING });
        const { data } = yield ApiAccount.getProfile();
        yield put({ type: GET_PROFILE.SUCCESS, data });
    } catch (error) {
        yield put({ type: GET_PROFILE.ERROR, error });
    }
}

function* getHouseList() {
    try {
        yield put({ type: GET_HOUSE_LIST.LOADING });
        const { data } = yield ApiAccount.getHouseList();
        yield put({ type: GET_HOUSE_LIST.SUCCESS, data });
    } catch (error) {
        yield put({ type: GET_HOUSE_LIST.ERROR, error });
    }
}

function* editProfile({ data, success }) {
    try {
        yield put({ type: EDIT_PROFILE.LOADING });
        yield updateProfile(data);

        yield put({ type: EDIT_PROFILE.SUCCESS, data, success });
    } catch (e) {
        yield put({ type: EDIT_PROFILE.ERROR, error: e });
    }
}

function* watchAccountData() {
    yield takeLatest(GET_PROFILE.actionName, getProfile);
    yield takeLatest(GET_HOUSE_LIST.actionName, getHouseList);
    yield takeLatest(EDIT_PROFILE.actionName, editProfile);
}

export default watchAccountData;
