import { createActionSet } from '../../../../../actions/index';

export const GET_AIRPORT = createActionSet('GET_AIRPORT');
export const GET_PRICE = createActionSet('GET_PRICE');
export const GET_EXTRA_PRICE = createActionSet('GET_EXTRA_PRICE');
export const CLEAR_DATA = 'CLEAR_DATA';
export const CLEAR_PRICE = 'CLEAR_PRICE';

export const GET_CAR_RENTAL_PRICE = createActionSet('GET_CAR_RENTAL_PRICE');

export const getAirport = () => ({
    type: GET_AIRPORT.actionName,
});

export const requestPrice = (data, callback) => ({
    type: GET_PRICE.actionName,
    requestData: data,
    errorCallback: callback,
});

export const requestExtraPrice = (data, callback, errorCallback) => ({
    type: GET_EXTRA_PRICE.actionName,
    requestData: data,
    successCallback: callback,
    errorCallback,
});

export const requestGetCarRentalPrice = (data, errorCallback) => ({
    type: GET_CAR_RENTAL_PRICE.actionName,
    requestData: data,
    errorCallback,
});

export const clearBookingData = () => ({
    type: CLEAR_DATA,
});
