import React from 'react';
import { StyleSheet } from 'react-native';
import AirportCarStep3 from '../../common/step3/container';
import Strings from '../../../../../../utils/LocalizationConfig';
import { ROUTE_FROM_AIRPORT } from '../../../../../../commons/const';
import { Utils } from '../../../../../../commons';
import * as ApiBooking from '../../../../../../services/apis/ApiBooking';

export default function AirportStep3({ navigation }) {
    const routeTitle = ({ airport, location, route }) => {
        const airportName = (airport) ? airport[`name_${Strings('language')}`] : '';
        const locationName = (location) ? location.address : '';
        return (route === ROUTE_FROM_AIRPORT) ? `${airportName} - ${locationName}` : `${locationName} - ${airportName}`;
    };

    const routeDescription = ({ date, time, vehicle }) => {
        const routeTime = Utils.routeTime(date, time);
        const routeVehicle = Utils.routeVehicle(vehicle);
        return [routeTime, routeVehicle];
    };

    const editPassengerParams = ({ passengerName, passengerPhoneNumber, route, noteForDriver, flightCode }) => {
        return {
            route,
            passengerName,
            passengerPhoneNumber,
            noteForDriver,
            flightCode,
            editPassengerInformation: true,
            service: 'UP',
        };
    };

    const editRouteParams = ({ airport, location, route, date, time, vehicle, price, extraPrice, priceToken }) => ({
        airport,
        location,
        route,
        date,
        time,
        vehicle,
        price,
        extraPrice,
        priceToken,
        editRouteInformation: true,
    });

    const routeInformationHaveChange = (state, data) => {
        const { airport, location, route, date, time, vehicle } = data;
        const stateAirport = state.airport;
        const stateLocation = state.location;
        const stateRoute = state.route;
        const stateDate = state.date;
        const stateTime = state.time;
        const stateVehicle = state.vehicle;

        return airport.symbol !== stateAirport.symbol
            || stateLocation.address !== location.address
            || stateRoute !== route
            || Utils.formatDate(date, 'DD/MM/YYYY') !== Utils.formatDate(stateDate, 'DD/MM/YYYY')
            || Utils.formatDate(time, 'HH:mm') !== Utils.formatDate(stateTime, 'HH:mm')
            || stateVehicle.symbol !== vehicle.symbol;
    };

    const requestData = (state, { priceToken, extraPriceSupplier, paymentMethod }) => {
        const { passengerName, passengerPhoneNumber, noteForDriver, flightCode } = state;

        const { location, airport, route, vehicle, date, time } = state;
        const locationName = location.address;
        const airportName = `${airport.name_vi} - ${airport.terminal_name_vi}`;
        const fromAirport = route === ROUTE_FROM_AIRPORT;

        const { commission } = state;
        const dateTimeBooking = `${Utils.formatDate(date, 'MM/DD/YYYY')} ${Utils.formatDate(time, 'hh:mm A')}`;

        return {
            name_passenger: passengerName,
            phone_passenger: passengerPhoneNumber,
            name_leave: fromAirport ? airportName : locationName,
            name_arrive: fromAirport ? locationName : airportName,
            vehicle_type: vehicle.symbol,
            price_datatoken: priceToken,
            price_salepoint: commission,
            extra_price_supplier: extraPriceSupplier,
            note_of_salepoint: noteForDriver,
            payment_method: paymentMethod.requestName,
            flight_code: flightCode,
            time_leave: dateTimeBooking,
        };
    };

    return (
        <AirportCarStep3
            navigation={navigation}
            editRouteParams={(params) => editRouteParams(params)}
            editPassengerParams={(params) => editPassengerParams(params)}
            routeInformationHaveChange={(state, data) => routeInformationHaveChange(state, data)}
            routeTitle={(params) => routeTitle(params)}
            routeDescription={(params) => routeDescription(params)}
            bookRideRequestData={(data, extraData) => requestData(data, extraData)}
            requestBookingService={(data) => ApiBooking.requestBooking(data)}
            step1Route="AirportStep1"
            step2Route="AirportStep2"
        />
    );
}

const styles = StyleSheet.create({});
