import { put, takeLatest } from 'redux-saga/effects';
import { GET_DAILY_STAT, GET_MONTHLY_STAT, GET_YEARLY_STAT } from './statAction';
import { DAILY, MONTHLY } from '../../../../commons/const';
import * as ApiStatistic from '../../../../services/apis/ApiStatistic';

const getStatAction = (type) => {
    switch (type) {
        case DAILY:
            return GET_DAILY_STAT;
        case MONTHLY:
            return GET_MONTHLY_STAT;
        default:
            return GET_YEARLY_STAT;
    }
};

function* getStatistic({ params }) {
    const action = getStatAction(params.type_get);
    yield put({ type: action.LOADING, ...params });
    try {
        const { data } = yield ApiStatistic.requestStatistic(params);
        yield put({ type: action.SUCCESS, data, ...params });
    } catch (error) {
        yield put({ type: action.ERROR, error });
    }
}

function* watchStatData() {
    yield takeLatest(GET_DAILY_STAT.actionName, getStatistic);
    yield takeLatest(GET_MONTHLY_STAT.actionName, getStatistic);
    yield takeLatest(GET_YEARLY_STAT.actionName, getStatistic);
}

export default watchStatData;
