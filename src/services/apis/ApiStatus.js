import { Constants } from '../../commons';
import ApiHelper from './ApiHelper';

export const fetchTripStatus = (data) => ApiHelper.post(Constants.SALE_POINT_TRIP_STATUS, data);

export const updateTime = (data) => ApiHelper.post(Constants.UPDATE_TIME_PATH, data);
