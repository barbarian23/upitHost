import { Constants } from '../../commons';
import ApiHelper from './ApiHelper';

export const getAirport = () => ApiHelper.get(Constants.GET_AIRPORT);

export const getExtraPriceSupplier = (data) => {
    let { time_leave, airport_symbol, vehicle_type } = data;
    return ApiHelper.get(Constants.GET_EXTRA_PRICE_SUPPLIER(time_leave, airport_symbol, vehicle_type));
};

export const getPriceFromDestination = (data) => ApiHelper.post(Constants.GET_PRICE_PATH, data);

export const requestBooking = (params) => ApiHelper.post(Constants.SALE_POINT_BOOKING, params);

export const requestGetPriceCarRental = (data) => ApiHelper.post(Constants.SYSTEM_GET_PRICE_CAR_RENTAL, data);

export const checkPlaceAvailable = (data) => ApiHelper.post(Constants.SYSTEM_CHECK_LOCATION_SUPPORTED, data);

export const requestBookingCarRental = (data) => ApiHelper.post(Constants.SYSTEM_BOOK_CAR_RENTAL, data);
