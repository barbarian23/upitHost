import { combineReducers } from 'redux';
import { commonReducer } from './CommonReducer';
import { accountReducer } from './AccountReducer';
import { statusReducer } from '../ui/screens/main/status/statusReducer';
import bookingReducer from '../ui/screens/main/booking/common/BookingReducer';
import trackingReducer from '../ui/screens/main/tracking/trackingReducer';
import statReducer from '../ui/screens/main/statistic/statReducer';
import profileReducer from '../ui/screens/main/profile/profileReducer';

const reducers = combineReducers(
    { commonReducer, accountReducer, bookingReducer, statusReducer, trackingReducer, statReducer, profileReducer },
);

export default reducers;
