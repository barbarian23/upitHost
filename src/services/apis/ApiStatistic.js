import { Constants } from '../../commons';
import ApiHelper from './ApiHelper';

export const requestStatistic = (data) => ApiHelper.post(Constants.GET_STATISTIC_PATH, data);

export const requestAllTripComplete = (data) => ApiHelper.post(Constants.GET_ALL_TRIP_COMPLETE_PATH, data);
