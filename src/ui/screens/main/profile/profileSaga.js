import { put, takeLatest } from 'redux-saga/effects';
import { FETCH_CURRENT_DEPT, FETCH_DEPT_LIST } from './profileActions';
import { fetchCurrentDept, fetchDeptList } from '../../../../services/apis/ApiProfile';

function* getDeptList(action) {
    try {
        yield put({ type: FETCH_DEPT_LIST.LOADING });
        let payload = yield fetchDeptList();

        yield put({ type: FETCH_DEPT_LIST.SUCCESS, payload: payload.data });
    } catch (e) {
        yield put({ type: FETCH_DEPT_LIST.ERROR, error: e });
    }
}

function* getCurrentDept(action) {
    try {
        yield put({ type: FETCH_CURRENT_DEPT.LOADING });
        let payload = yield fetchCurrentDept();

        yield put({ type: FETCH_CURRENT_DEPT.SUCCESS, payload: payload.data });
    } catch (e) {
        yield put({ type: FETCH_CURRENT_DEPT.ERROR, error: e });
    }
}

function* watchProfileData() {
    yield takeLatest(FETCH_DEPT_LIST.actionName, getDeptList);
    yield takeLatest(FETCH_CURRENT_DEPT.actionName, getCurrentDept);
}

export default watchProfileData;
