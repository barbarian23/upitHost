import { put, takeLatest } from 'redux-saga/effects';
import { GET_AIRPORT, GET_CAR_RENTAL_PRICE, GET_EXTRA_PRICE, GET_PRICE } from './BookingAction';
import * as ApiBooking from '../../../../../services/apis/ApiBooking';

function* getAirports() {
    try {
        yield put({ type: GET_AIRPORT.LOADING });
        const { data } = yield ApiBooking.getAirport();
        yield put({ type: GET_AIRPORT.SUCCESS, data });
    } catch (error) {
        yield put({ type: GET_AIRPORT.ERROR, error });
    }
}

function* getPrice(action) {
    const { requestData, errorCallback } = action;
    try {
        yield put({ type: GET_PRICE.LOADING });
        const { data } = yield ApiBooking.getPriceFromDestination(requestData);
        yield put({ type: GET_PRICE.SUCCESS, data });
    } catch (error) {
        yield put({ type: GET_PRICE.ERROR, errorCallback });
    }
}

function* getExtraPrice(action) {
    const { requestData, successCallback, errorCallback } = action;
    try {
        yield put({ type: GET_EXTRA_PRICE.LOADING });
        const { data } = yield ApiBooking.getExtraPriceSupplier(requestData);
        yield put({ type: GET_EXTRA_PRICE.SUCCESS, data, successCallback });
    } catch (error) {
        yield put({ type: GET_EXTRA_PRICE.ERROR, errorCallback, error });
    }
}

function* getCarRentalPrice(action) {
    const { requestData, errorCallback } = action;
    try {
        yield put({ type: GET_CAR_RENTAL_PRICE.LOADING });
        const { data } = yield ApiBooking.requestGetPriceCarRental(requestData);

        yield put({ type: GET_CAR_RENTAL_PRICE.SUCCESS, data });
    } catch (error) {
        yield put({ type: GET_CAR_RENTAL_PRICE.ERROR, errorCallback, error });
    }
}

function* watchBookingSaga() {
    yield takeLatest(GET_AIRPORT.actionName, getAirports);
    yield takeLatest(GET_PRICE.actionName, getPrice);
    yield takeLatest(GET_EXTRA_PRICE.actionName, getExtraPrice);
    yield takeLatest(GET_CAR_RENTAL_PRICE.actionName, getCarRentalPrice);
}

export default watchBookingSaga;
