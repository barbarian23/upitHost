import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import { clearBookingData, getAirport } from '../../common/BookingAction';
import { getProfile } from '../../../../../../actions/accountActions';
import AppPressInput from '../../../../../components/form/AppPressInput';
import styles from './styles';
import Strings from '../../../../../../utils/LocalizationConfig';
import DateTimeField from '../../common/datetime/DateTimeField';
import renderIf, * as Utils from '../../../../../../commons/utils';
import { calculateDateDiff, DEFAULT_TIME, formatDate, normalize, parseDate } from '../../../../../../commons/utils';
import AppText from '../../../../../components/text/AppTextView';
import AppButton from '../../../../../components/button/AppButton';
import AppScrollViewContainer from '../../../../../components/container/scroll';
import { Colors, Constants } from '../../../../../../commons';
import { getPriceFromRoute } from '../../airporttransfer/step1/vehicle';
import PickUpTimeErrorDialog from '../../common/dialog/PickUpTimeErrorDialog';
import AppImage from '../../../../../components/image/AppImage';
import PriceInformationDialog from '../../common/dialog/PriceInformation';
import * as ApiBooking from '../../../../../../services/apis/ApiBooking';

class CarRentalStep1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lastBookingAirport: null,
            duration: null,
            location: null,
            date: new Date(),
            time: null,
            timeError: '',
            vehicle: null,
            dialog: null,

            price: null,
            loadingGetPrice: false,
            priceToken: '',
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.getAirportFromProps();

        // This will have value if this screen has been navigated from Step3 (Edit op)
        const navigationParams = Utils.getAllParamFromNavigation(navigation);
        this.setState({
            ...navigationParams,
        });
    }

    renderMainForm() {
        const { price, loadingGetPrice } = this.state;
        const { navigation, airports } = this.props;
        const duration = this.getDuration();
        const { location, date, time, timeError } = this.state;

        return (
            <View>
                <View style={styles.formContainer}>
                    <AppPressInput
                        value={location ? location.address : ''}
                        title={Strings('label.pick_up_location')}
                        rightButton
                        icon={require('../../../../../../assets/icons/ic_location_car_rental.png')}
                        placeholder={Strings('label.choose_location')}
                        onPress={() => {
                            navigation.navigate('LocationPicker', {
                                service: 'CR',
                                airportList: airports,
                                location,
                                callback: (loc) => this.locationSelected(loc),
                            });
                        }}
                    />

                    <AppPressInput
                        value={duration ? Strings(duration.title) : ''}
                        title={Strings('label.duration')}
                        rightButton
                        icon={require('../../../../../../assets/icons/ic_queue.png')}
                        placeholder={Strings('label.choose_duration')}
                        onPress={() => {
                            navigation.navigate('DurationPicker', {
                                selectedDuration: duration,
                                callback: (d) => this.durationSelected(d),
                            });
                        }}
                        containerStyle={{
                            marginTop: normalize(24),
                        }}
                    />

                    <DateTimeField
                        loading={loadingGetPrice}
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
                                    this.validateFormAndRequestPrice(time);
                                }
                            });
                        }}
                        timeSelected={(t: any) => {
                            this.validateFormAndRequestPrice(t);
                        }}
                        error={timeError}
                        // loading={airportBookingDateAndTimeLoading}
                    />
                </View>
                <View
                    style={styles.priceInformationButtonContainer}
                >
                    <TouchableOpacity
                        onPress={() => this.showPriceInformationDialog()}
                        style={styles.priceInformationButtonInnerContainer}>
                        <AppImage
                            source="ic_information"
                            style={{ width: normalize(20), height: normalize(20), tintColor: Colors.COLOR_SECONDARY }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    renderVehicleTypeSection() {
        const { navigation } = this.props;
        const { vehicle, ridePrice } = this.getVehicle();
        const { price, loadingGetPrice } = this.state;

        const priceAvailable = vehicle && price;

        const { total } = priceAvailable ? getPriceFromRoute(ridePrice, 0) : { total: 0 };
        return (priceAvailable) ? (
            <View style={{ marginTop: normalize(16) }}>
                <AppText>{Strings('label.select_vehicle_type')}</AppText>
                <TouchableOpacity
                    onPress={() => navigation.navigate('VehiclePicker', {
                        selected: vehicle,
                        callback: (v) => this.vehicleSelected(v),
                        price,
                        service: 'CR',
                        vehicles: this.getVehicleListFromPrice(price).map((v) => v.vehicle),
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

    renderMoveToNextStepMessage = (visible) => (
        renderIf(visible,
            <AppText
                style={styles.moveToNextStepWarningMessage}
            >
                {Strings('label.fill_in_contact_warning_message')}
            </AppText>)
    );

    renderNextButton() {
        const { editRouteInformation } = this.state;
        const buttonText = editRouteInformation ? Strings('label.edit') : Strings('label.fill_in_contact');

        return (
            <View style={styles.moveToNextStepView}>
                {this.renderMoveToNextStepMessage(true)}
                <AppButton
                    disabled={!this.isReadyToMoveToStep2()}
                    text={buttonText}
                    onPress={() => this.moveToStep2()}
                />
            </View>
        );
    }

    render() {
        const { dialog } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <AppScrollViewContainer>
                    {this.renderMainForm()}
                    {this.renderVehicleTypeSection()}
                </AppScrollViewContainer>
                {this.renderNextButton()}
                {dialog}
            </View>
        );
    }

    showPriceInformationDialog() {
        this.setState({
            dialog: (
                <PriceInformationDialog
                    onClose={() => {
                        this.setState({
                            dialog: null,
                        });
                    }}
                />
            ),
        });
    }

    moveToStep2() {
        const { navigation } = this.props;
        const { date, time, location, editRouteInformation, editCallback, price, priceToken } = this.state;
        const duration = this.getDuration();
        const { vehicle } = this.getVehicle();

        if (editRouteInformation) {
            navigation.goBack();
            editCallback({ location, date, time, vehicle, duration, price, priceToken });
        } else {
            navigation.navigate('Step2', {
                date,
                time,
                location,
                duration,
                vehicle,
                service: 'CR',
                price,
                priceToken,
            });
        }
    }

    vehicleSelected = (vehicle) => {
        this.setState({
            vehicle,
        });
    };

    getVehicleListFromPrice = (price) => Object.keys(price).map((key) => ({
        vehicle: Constants.CARRENTAL_CAR_TYPE[key],
        ridePrice: price[key],
    }));

    getVehicleWithPriceObject = (vehicle, price) => (vehicle ? ({
        vehicle,
        ridePrice: (price && vehicle && vehicle.symbol) ? price[vehicle.symbol] : null,
    }) : null);

    getVehicle = () => {
        const nullObject = {
            vehicle: null,
            ridePrice: null,
        };
        const { vehicle } = this.state;
        const { price } = this.state;
        const list = price && price ? this.getVehicleListFromPrice(price) : [];
        return this.getVehicleWithPriceObject(vehicle, price) || (price ? list[0] : nullObject) || nullObject;
    };

    durationSelected(duration) {
        const { time, location } = this.state;
        this.setState({ duration }, () => {
            if (time) {
                this.validateTimeAndDate(time, () => {
                    if (location) {
                        this.requestCarRentalPrice();
                    }
                });
            } else {
                this.setState({
                    timeError: '',
                });
            }
        });
    }

    locationSelected(location) {
        this.setState({
            location,
        }, () => {
            const duration = this.getDuration();
            const { date, time } = this.state;
            if (duration && date && time) {
                this.requestCarRentalPrice();
            }
        });
    }

    minutesOfDay(time) {
        const hours = time.hour();
        const minutes = time.minute();
        return hours * 60 + minutes;
    }

    compareWithinHour(fromTime, toTime, time) {
        const hour = time.hour();
        return hour < fromTime || this.minutesOfDay(time) > toTime * 60;
    }

    validateTimeWithDuration(duration, selectedDateTime, validAction) {
        if (duration.id === 1 && this.compareWithinHour(7, 12, selectedDateTime)) {
            this.setState({
                timeError: `* ${Strings('label.time_error_first_half')}`,
                time: null,
            });
        } else if (duration.id === 2 && this.compareWithinHour(12, 17, selectedDateTime)) {
            this.setState({
                timeError: `* ${Strings('label.time_error_second_half')}`,
                time: null,
            });
        } else if (duration.id === 3 && this.compareWithinHour(7, 17, selectedDateTime)) {
            this.setState({
                timeError: `* ${Strings('label.time_error_all_day')}`,
                time: null,
            });
        } else {
            this.setState({
                timeError: '',
                time: selectedDateTime.toDate(),
            }, () => {
                validAction();
            });
        }
    }

    validateTimeAndDate(time, validAction) {
        const { date, duration } = this.state;
        const dateString = Utils.formatDate(date, 'DD/MM/YYYY');
        const timeString = time ? formatDate(time, 'HH : mm') : DEFAULT_TIME;
        const selectedDateTime = parseDate(`${dateString} ${timeString}`, 'DD/MM/YYYY HH : mm');
        const valid = !(calculateDateDiff(new Date(), date) === 0 && selectedDateTime.isBefore(moment()));
        if (!valid) {
            this.setState({
                timeError: Strings('message.time_not_valid'),
                time: null,
            });
        } else if (duration) {
            this.validateTimeWithDuration(duration, selectedDateTime, validAction);
        } else {
            this.setState({
                timeError: '',
                time: selectedDateTime.toDate(),
            }, () => {
                validAction();
            });
        }
    }

    validateFormAndRequestPrice(time) {
        const { duration, location } = this.state;
        this.validateTimeAndDate(time, () => {
            if (duration && location) {
                this.requestCarRentalPrice();
            }
        });
    }

    isReadyToMoveToStep2() {
        const { location, duration } = this.state;
        const { time, date } = this.state;

        return date && time && Utils.isDateTimeValid(date, time) && location && duration;
    }

    getAirportFromProps() {
        const { fetchAirports, airports } = this.props;
        Utils.invokeIfDataIsEmpty(airports, fetchAirports);
    }

    getDuration = () => {
        const { duration } = this.state;
        return duration;
    };

    requestCarRentalPrice() {
        const { date, time } = this.state;
        const duration = this.getDuration();
        const { location } = this.state;

        let params = {
            carrental_type: duration.request,
            time_leave: this.getTimeString(date, time),
        };
        if (location.houseData) {
            params.house_code = location.houseData.code;
        } else {
            params = {
                ...params,
                ...location.geometry,
            };
        }
        this.fetchPrice(params, (error) => this.getPriceError(error));
    }

    fetchPrice(requestData) {
        this.setState({
            loadingGetPrice: true,
        });
        setTimeout(() => {
            ApiBooking.requestGetPriceCarRental(requestData)
                .then(({ data }) => {
                    const { price, data_token } = data;
                    this.setState({
                        price,
                        priceToken: data_token,
                        loadingGetPrice: false,
                    });
                })
                .catch((error) => {
                    this.getPriceError(error);
                });
        }, 400);
    }

    getPriceError(error) {
        if (error && error.messages && error.messages.status === 455) {
            this.setState({
                loadingGetPrice: false,
                time: null,
                dialog: (
                    <PickUpTimeErrorDialog
                        onClose={() => {
                            this.setState({
                                dialog: null,
                            });
                        }}
                    />
                ),
            });
        }
    }

    getTimeString = (date, time) => `${Utils.formatDate(date, 'YYYY-MM-DD')} ${Utils.formatDate(time, 'HH:mm:ss')}`;
}

const mapStateToProps = (state) => ({
    airports: state.bookingReducer.airports.data,
    // price: state.bookingReducer.price,
});

export const mapDispatchToProps = (dispatch) => ({
    fetchAirports: () => dispatch(getAirport()),
    fetchProfile: () => dispatch(getProfile()),
    // fetchPrice: (data, errorCallback) => dispatch(requestGetCarRentalPrice(data, errorCallback)),
    dispatchClearBookingData: () => dispatch(clearBookingData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CarRentalStep1);
