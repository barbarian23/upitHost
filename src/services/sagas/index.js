import { all } from 'redux-saga/effects';
import watchAccountData from './AccountSaga';
import watchBookingSaga from '../../ui/screens/main/booking/common/BookingSaga';
import watchStatusData from '../../ui/screens/main/status/statusSagas';
import watchTrackingData from '../../ui/screens/main/tracking/trackingSagas';
import watchStatData from '../../ui/screens/main/statistic/statSagas';
import watchProfileData from '../../ui/screens/main/profile/profileSaga';

export default function* rootSaga() {
    yield all([
        watchProfileData(),
        watchAccountData(),
        watchBookingSaga(),
        watchStatusData(),
        watchTrackingData(),
        watchStatData(),
    ]);
}
