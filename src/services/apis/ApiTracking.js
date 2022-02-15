import { Constants } from '../../commons';
import ApiHelper from './ApiHelper';

export const fetchTripStatus = (data) => ApiHelper.post(Constants.SALE_POINT_TRIP_STATUS, data);

export const requestListeningLocation = (data) => ApiHelper.post(Constants.REGISTER_LISTENING_LOCATION, data);
