import React, { Component } from 'react';
import { Image, ScrollView, StatusBar, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { Colors, Constants, Storage, Utils } from '../../../../../../commons';
import styles from './styles';
import AppButton from '../../../../../components/button/AppButton';
import Strings from '../../../../../../utils/LocalizationConfig';
import AppText from '../../../../../components/text/AppTextView';
import renderIf, { normalize } from '../../../../../../commons/utils';
import AppPressInput from '../../../../../components/form/AppPressInput';
import { clearBookingData, getAirport } from '../../common/BookingAction';
import DateTimeField, { DEFAULT_TIME } from '../../common/datetime/DateTimeField';
import { ROUTE_FROM_AIRPORT, ROUTE_TO_AIRPORT } from '../../../../../../commons/const';
import { getProfile } from '../../../../../../actions/accountActions';
import { estimatePrice, getPriceFromSymbol } from './vehicle';
import * as ApiBooking from '../../../../../../services/apis/ApiBooking';
import PickUpTimeErrorDialog from '../../common/dialog/PickUpTimeErrorDialog';

class AirportCarStep1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editRouteInformation: false,
            route: Constants.ROUTE_FROM_AIRPORT,
            airport: null,
            location: null,
            date: new Date(),

            time: null,
            timeError: '',

            lastBookingAirport: null,

            vehicle: null,

            loadingGetPrice: false,
            price: null,
            priceToken: '',

            loadingExtraPrice: false,
            extraPrice: 0,

            dialog: null,
        };
    }

    async componentDidMount() {
        const { navigation } = this.props;

        this.checkAndFetchAirportList();
        this.checkAndFetchUserProfile();
        const lastBookingAirport = await Storage.getDataJson(Constants.KEY_AIRPORT);

        // This will have value if this screen has been navigated from Step3 (Edit op)
        const navigationParams = Utils.getAllParamFromNavigation(navigation);

        this.setState({
            lastBookingAirport,
            ...navigationParams,
        });
    }

    renderMoveToNextStepMessage = (visible) => (
        renderIf(visible,
            <AppText
                style={styles.moveToNextStepWarningMessage}
            >
                {Strings('label.fill_in_contact_warning_message')}
            </AppText>)
    );

    renderMoveToNextStepButton() {
        const { editRouteInformation } = this.state;
        const buttonText = editRouteInformation ? Strings('label.edit') : Strings('label.fill_in_contact');
        return (
            <View style={styles.moveToNextStepView}>
                {this.renderMoveToNextStepMessage(!editRouteInformation)}
                <AppButton
                    disabled={!this.isReadyToMoveToStep2()}
                    text={buttonText}
                    onPress={() => this.moveToStep2()}
                />
            </View>
        );
    }

    moveToStep2() {
        const { location, date, time, route, editRouteInformation, editCallback, price, extraPrice, priceToken } = this.state;
        const vehicle = this.getVehicle();
        const airport = this.getAirport();

        const { navigation } = this.props;
        if (editRouteInformation) {
            /**
             * Exception case:
             * Before edit: Route to airport (flight code is non-require)
             * Edit: Edit to route from airport type
             * --> Flight code is require
             */
            const oldRoute = Utils.getParamFromNavigation(navigation, 'route');
            if (oldRoute === ROUTE_TO_AIRPORT && route === ROUTE_FROM_AIRPORT) {
                const editData = {
                    ...Utils.getAllParamFromNavigation(navigation),
                    ...{ priceToken, location, date, time, vehicle, airport, route, service: 'UP', editFromStep1: true, callback: editCallback, price, extraPrice },
                };
                navigation.push('AirportStep2', editData);
            } else {
                navigation.goBack();
                const callbackData = { location, date, time, route, vehicle, airport, price, extraPrice, priceToken };
                if (route === ROUTE_TO_AIRPORT) callbackData.flightCode = '';
                editCallback(callbackData);
            }
        } else {
            navigation.navigate('AirportStep2', { location, date, time, vehicle, airport, route, price, extraPrice, priceToken, service: 'UP' });
        }
    }

    renderRouteTypeSection() {
        const { route } = this.state;
        const { navigation } = this.props;

        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('RoutePicker', {
                            route,
                            callback: (r) => this.routeSelected(r),
                        });
                    }}
                    style={styles.routeTypeSelectionContainer}
                >
                    <AppText style={styles.routeType}>
                        {(route === Constants.ROUTE_FROM_AIRPORT)
                            ? Strings('label.from_airport')
                            : Strings('label.to_airport')}
                    </AppText>
                    <Image
                        style={styles.downArrow}
                        source={require('../../../../../../assets/icons/ic_down_arrow.png')}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    renderTimeAndDestinationSection() {
        const { loadingGetPrice } = this.state;
        const { navigation } = this.props;
        const { loadingExtraPrice } = this.state;

        const selectedAirport = this.getAirport();
        const { location } = this.state;
        const { date } = this.state;
        const { timeError, time } = this.state;
        const { route } = this.state;
        const airportLabel = () => ((route === ROUTE_FROM_AIRPORT) ? Strings('label.from') : Strings('label.to'));
        const locationLabel = () => ((route !== ROUTE_FROM_AIRPORT) ? Strings('label.from') : Strings('label.to'));

        const airportIcon = () => ((route === ROUTE_FROM_AIRPORT)
            ? require('../../../../../../assets/icons/ic_flight_land.png')
            : require('../../../../../../assets/icons/ic_flight_takeoff.png'));

        return (
            <View style={styles.timeAndDestinationContainer}>
                <View
                    style={(route === ROUTE_FROM_AIRPORT) ? styles.destinationContainerFromAirport : styles.destinationContainerToAirport}
                >
                    <AppPressInput
                        disabled={!(this.getAirport())}
                        value={selectedAirport ? selectedAirport[`name_${Strings('language')}`] : ''}
                        title={airportLabel()}
                        rightButton
                        icon={airportIcon()}
                        placeholder={Strings('label.choose_airport')}
                        onPress={() => navigation.navigate('AirportPicker', {
                            airport: this.getAirport(),
                            callback: (airport) => this.airportSelected(airport),
                        })}
                    />
                    <View style={{ height: normalize(24) }} />
                    <AppPressInput
                        value={location ? location.address : ''}
                        title={locationLabel()}
                        rightButton
                        icon={require('../../../../../../assets/icons/ic_home.png')}
                        placeholder={Strings('label.choose_location')}
                        onPress={() => navigation.navigate('LocationPicker', {
                            airport: this.getAirport(),
                            callback: (loc) => this.locationSelected(loc),
                            location,
                        })}
                        disabled={loadingGetPrice}
                    />
                </View>
                <DateTimeField
                    loading={loadingExtraPrice}
                    date={date}
                    time={time}
                    title={Strings('label.time')}
                    containerStyle={{
                        marginTop: normalize(24),
                    }}
                    dateSelected={(d: any) => {
                        this.setState({
                            date: d,
                        }, () => {
                            if (time) {
                                this.validateTime(time);
                            }
                        });
                    }}
                    timeSelected={(t: any) => {
                        this.validateTime(t);
                    }}
                    error={timeError}
                    // loading={airportBookingDateAndTimeLoading}
                />
            </View>
        );
    }

    renderVehicleTypeSection() {
        const { price, extraPrice } = this.state;
        const { navigation } = this.props;
        const vehicle = this.getVehicle();
        const airport = this.getAirport();
        const { route, loadingGetPrice } = this.state;
        // const bookingExtraPrice = (extraPrice) ? extraPrice.data.extra_price_supplier : 0;

        const { total } = vehicle ? estimatePrice(getPriceFromSymbol(price, vehicle.symbol), route, extraPrice) : { total: 0 };

        return (vehicle && airport) ? (
            <View style={{ marginTop: normalize(16) }}>
                <AppText>{Strings('label.select_vehicle_type')}</AppText>
                <TouchableOpacity
                    onPress={() => navigation.navigate('VehiclePicker', {
                        vehicles: airport.car_type,
                        selected: vehicle,
                        callback: (v) => this.vehicleSelected(v),
                        price,
                        extraPrice,
                        route,
                    })}
                    style={styles.vehicleTypeSelectContainer}
                >
                    <Image
                        source={Utils.vehicleIcon(vehicle.symbol)}
                        style={styles.vehicleTypeImage}
                    />
                    <View style={{ marginStart: normalize(12), flex: 1 }}>
                        <AppText
                            style={styles.vehicleTypeSelectTitle}
                        >
                            {`${vehicle.name} - ${Strings('label.maximum')} ${vehicle.seat} ${Strings('label.passenger')}`}
                        </AppText>
                        {renderIf(total !== -1,
                            <AppText
                                style={styles.vehicleTypeSelectDescription}
                            >
                                {(loadingGetPrice) ? '...' : `Est: ~${Utils.formatVND(total)}`}
                            </AppText>)}
                    </View>
                    <Image
                        style={{ width: normalize(12), height: normalize(7) }}
                        source={require('../../../../../../assets/icons/ic_down_arrow.png')}
                    />
                </TouchableOpacity>
            </View>
        ) : <View />;
    }

    timeErrorCallSupportDialog(description) {
        return (
            <PickUpTimeErrorDialog
                message={description}
                onClose={() => {
                    this.setState({
                        dialog: null,
                    });
                }}
            />
        );
    }

    render() {
        const { price } = this.state;
        const { dialog } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: Colors.COLOR_NEUTRAL_7 }}>
                <StatusBar
                    backgroundColor={Colors.COLOR_WHITE}
                    barStyle="dark-content"
                />
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ padding: normalize(16) }}>
                        {this.renderRouteTypeSection()}
                        {this.renderTimeAndDestinationSection()}
                        {renderIf(price, this.renderVehicleTypeSection())}
                    </View>
                </ScrollView>
                {this.renderMoveToNextStepButton()}
                {dialog}
            </View>
        );
    }

    validateTime(time) {
        const { date } = this.state;
        const dateString = Utils.formatDate(date, 'DD/MM/YYYY');
        const current = new Date();

        const timeString = time ? Utils.formatDate(time, 'HH : mm') : DEFAULT_TIME;
        const selectedDateTime = Utils.parseDate(`${dateString} ${timeString}`, 'DD/MM/YYYY HH : mm');

        // console.log(selectedDateTime, Utils.calculateDateDiff(current, date), selectedDateTime.isBefore(moment()));
        if (Utils.calculateDateDiff(current, date) === 0 && selectedDateTime.isBefore(moment())) {
            this.setState({
                timeError: Strings('message.time_not_valid'),
                time: null,
            });
        } else {
            this.setState({
                timeError: null,
                time: null,
            }, () => {
                this.validateWithServer(selectedDateTime);
            });
        }
    }

    airportSelected(airport) {
        const { location, time } = this.state;
        const { dispatchClearBookingData } = this.props;
        const changeToDifferentAirport = !(location && location.airportSymbol === airport.symbol);
        const vehicle = this.findCurrentAvailableVehicle(airport);

        this.setState({
            airport,
            location: (changeToDifferentAirport) ? null : location,
            time: (changeToDifferentAirport) ? null : time,
            vehicle,
        }, () => {
            if (changeToDifferentAirport) {
                dispatchClearBookingData();
            }
        });
    }

    findCurrentAvailableVehicle(airport) {
        const vehicle = this.getVehicle();
        const availableVehicles = airport.car_type;

        const veh = availableVehicles.find((v) => v.symbol === vehicle.symbol);
        if (!veh) {
            Utils.showToast(`${vehicle.name} ${Strings('message.vehicle_is_not_available')} ${airport[`name_${Strings('language')}`]}`);
        }
        return veh || availableVehicles[0];
    }

    locationSelected(location) {
        this.setState({
            location,
        }, () => {
            this.getPriceFromDestination();
        });
    }

    vehicleSelected(vehicle) {
        this.setState({
            vehicle,
        });
    }

    routeSelected(route) {
        this.setState({
            route,
        });
    }

    validateWithServer(selectedDateTime) {
        // const { fetchExtraPrice } = this.props;
        let requestData = {
            time_leave: Utils.formatDate(selectedDateTime, 'YYYY-MM-DD HH:mm:ss'),
            vehicle_type: this.getVehicle().symbol,
            airport_symbol: this.getAirport().symbol,
        };
        this.fetchExtraPrice(requestData, selectedDateTime);
        // fetchExtraPrice(requestData,
        //     () => this.requestExtraPriceSuccessCallback(selectedDateTime),
        //     (error) => this.requestExtraPriceErrorCallback(error));
    }

    fetchExtraPrice(requestData, time) {
        this.setState({ loadingExtraPrice: true });
        setTimeout(() => {
            ApiBooking.getExtraPriceSupplier(requestData)
                .then(({ data }) => {
                    this.setState({
                        extraPrice: data ? data.extra_price_supplier : 0,
                        loadingExtraPrice: false,
                        time: time.toDate(),
                    });
                })
                .catch(({ messages }) => {
                    if (messages && messages.code === 'TIME_LEAVE_ERROR_PLEASE_CALL_SUPPORTER') {
                        this.setState({
                            dialog: this.timeErrorCallSupportDialog(messages.message),
                            extraPrice: 0,
                            loadingExtraPrice: false,
                        });
                    } else {
                        this.setState({
                            extraPrice: 0,
                            loadingExtraPrice: false,
                            timeError: messages && messages.message ? messages.message : Strings(`messages.time_not_valid`),
                        });
                    }
                });
        }, 400);
    }

    getPriceFromDestination() {
        const { location } = this.state;
        const { profile, fetchPrice } = this.props;
        const airport = this.getAirport();

        let requestData = {};
        if (location.houseData) {
            const { houseData } = location;

            requestData.house_code = houseData.code;
            requestData.airport_symbol = airport.symbol;
        } else {
            const { geometry } = location;
            requestData = {
                ...geometry,
                airport_symbol: airport.symbol,
                salepointId: profile.id,
            };
        }
        // fetchPrice(requestData, (error) => this.requestPriceFailed(error));
        this.requestPrice(requestData);
    }

    requestPrice(requestData) {
        this.setState({
            loadingGetPrice: true,
        });
        setTimeout(() => {
            ApiBooking.getPriceFromDestination(requestData)
                .then(({ data }) => {
                    const { price, data_token } = data;
                    this.setState({
                        price,
                        priceToken: data_token,
                        loadingGetPrice: false,
                    });
                })
                .catch((error) => {
                    this.requestPriceFailed(error);
                });
        }, 400);
    }

    requestPriceFailed(error) {
        console.log('RequestBookingPriceFailed', error);
        this.setState({
            location: null,
            price: null,
            priceToken: '',
            loadingGetPrice: false,
        }, () => {
            Utils.showToast(Strings('message.request_price_error'));
        });
    }

    getVehicle = () => {
        const { vehicle } = this.state;
        console.log('vehicleselect::', vehicle);
        const airport = this.getAirport();
        return vehicle || (airport ? airport.car_type[0] : null) || null;
    };

    getAirport = () => {
        const { airport, lastBookingAirport } = this.state;
        const { airports } = this.props;

        return airport || lastBookingAirport || airports[0] || null;
    };

    checkAndFetchAirportList() {
        const { airports, fetchAirports } = this.props;
        Utils.invokeIfDataIsEmpty(airports, fetchAirports);
    }

    checkAndFetchUserProfile() {
        const { profile, fetchProfile } = this.props;
        Utils.invokeIfDataIsNull(profile, fetchProfile);
    }

    isReadyToMoveToStep2() {
        const { location, price, loadingGetPrice } = this.state;
        const { loadingExtraPrice } = this.state;
        const { time } = this.state;

        return (location && price && time && !loadingGetPrice && !loadingExtraPrice);
    }
}

const mapStateToProps = (state) => ({
    airports: state.bookingReducer.airports.data,
    profile: state.accountReducer.profile.data,
});

export const mapDispatchToProps = (dispatch) => ({
    fetchAirports: () => dispatch(getAirport()),
    fetchProfile: () => dispatch(getProfile()),
    dispatchClearBookingData: () => dispatch(clearBookingData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AirportCarStep1);
