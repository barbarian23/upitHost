import React from 'react';
import { StyleSheet } from 'react-native';
import AirportCarStep3 from '../../common/step3/container';
import Strings from '../../../../../../utils/LocalizationConfig';
import { Utils } from '../../../../../../commons';
import * as ApiBooking from '../../../../../../services/apis/ApiBooking';

export default function CarRentalStep3({ navigation }) {
    const routeTitle = ({ location }) => ((location) ? location.address : '');

    const routeDescription = ({ date, time, vehicle, duration }) => {
        const durationString = duration ? `${Strings(duration.title)} (${duration.from}:00 - ${duration.to}:00)` : '';

        const routeTime = Utils.routeTime(date, time);
        const routeVehicle = Utils.routeVehicle(vehicle);
        return [durationString, routeTime, routeVehicle];
    };

    const editPassengerParams = ({ passengerName, passengerPhoneNumber, noteForDriver }) => {
        return {
            passengerName,
            passengerPhoneNumber,
            noteForDriver,
            editPassengerInformation: true,
        };
    };

    const editRouteParams = ({ location, date, time, vehicle, duration, price, priceToken }) => ({
        location,
        date,
        time,
        vehicle,
        duration,
        editRouteInformation: true,
        service: 'CR',
        price,
        priceToken,
    });

    const routeInformationHaveChange = (state, data) => {
        const { location, date, time, vehicle, duration } = data;

        const stateLocation = state.location;
        const stateDate = state.date;
        const stateTime = state.time;
        const stateVehicle = state.vehicle;
        const stateDuration = state.duration;

        return stateLocation.address !== location.address
            || Utils.formatDate(date, 'DD/MM/YYYY') !== Utils.formatDate(stateDate, 'DD/MM/YYYY')
            || Utils.formatDate(time, 'HH:mm') !== Utils.formatDate(stateTime, 'HH:mm')
            || stateVehicle.symbol !== vehicle.symbol
            || stateDuration.id !== duration.id;
    };

    const requestData = (state, { priceToken, extraPriceSupplier, paymentMethod }) => {
        const { passengerName, passengerPhoneNumber, noteForDriver } = state;

        const { location, vehicle } = state;
        const locationName = location.address;

        const { commission } = state;

        return {
            name_passenger: passengerName,
            phone_passenger: passengerPhoneNumber,
            name_leave: locationName,
            vehicle_type: vehicle.symbol,
            price_datatoken: priceToken,
            price_salepoint: commission,
            extra_price_supplier: extraPriceSupplier,
            note_of_salepoint: noteForDriver,
            payment_method: paymentMethod.requestName,
        };
    };

    return (
        <AirportCarStep3
            navigation={navigation}
            editPassengerParams={(params) => editPassengerParams(params)}
            editRouteParams={(params) => editRouteParams(params)}
            routeInformationHaveChange={(state, data) => routeInformationHaveChange(state, data)}
            routeTitle={(params) => routeTitle(params)}
            routeDescription={(params) => routeDescription(params)}
            bookRideRequestData={(state, extraData) => requestData(state, extraData)}
            requestBookingService={(data) => ApiBooking.requestBookingCarRental(data)}
            step1Route="Step1"
            step2Route="Step2"
        />
    );
}

const styles = StyleSheet.create({});
