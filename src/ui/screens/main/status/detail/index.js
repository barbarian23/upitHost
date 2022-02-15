import React, { Component } from 'react';
import { Image, Platform, ScrollView, TouchableOpacity, UIManager, View } from 'react-native';
import moment from 'moment';
import Spinner from 'react-native-spinkit';
import AppContainer from '../../../../components/container';
import AirportBookingHeader from '../../../../components/header/authHeader/AirportBookingHeader';
import { Colors, Constants, Styles, Utils } from '../../../../../commons';
import styles from './styles';
import AppText from '../../../../components/text/AppTextView';
import Strings from '../../../../../utils/LocalizationConfig';
import renderIf, { normalize } from '../../../../../commons/utils';
import Collapsible from '../../../../components/layout/Collapsible';
import { debtPayment, payOnline, payWithCash } from '../../../../../commons/const';
import AppButton from '../../../../components/button/AppButton';
import ApiHelper from '../../../../../services/apis/ApiHelper';
import AppDialog from '../../../../components/dialog/AppDialog';
import UpdateTimeInstruction from './UpdateTimeInstruction';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default class BookingDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            type: '',
            editTimeNotAvailable: '',
            updateTimeInstructionDialogVisible: false,
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        const data = Utils.getAllParamFromNavigation(navigation);
        console.log('detail data', data);

        const timeLeaveMoment = moment(data.data.time_leave, Constants.SERVER_TIME_DATE_FORMAT);
        const timeLeave = timeLeaveMoment.toDate();
        const current = new Date();

        const minuteDiff = Utils.calculateMinuteDiff(current, timeLeave);
        const dateDiff = Utils.calculateDateDiff(current, timeLeave);

        this.setState({
            ...data,
        });

        if (dateDiff === 0 && minuteDiff < 20) {
            this.setState({
                editTimeNotAvailable: Strings('message.edit_time_not_available'),
            });
        }

        if (dateDiff === 1 && timeLeaveMoment.hours() >= 0 && timeLeaveMoment.hours() <= 9 && moment().hours() >= 19) {
            this.setState({
                editTimeNotAvailable: Strings('message.edit_time_not_available_after_20'),
            });
        }
    }

    renderHeader = () => {
        const { navigation } = this.props;
        const { data } = this.state;

        return (
            <AirportBookingHeader
                navigation={navigation}
                title={`#${data ? Utils.displaySerial(data) : ''}`}
            />
        );
    };

    tripStatusImage = (step) => {
        switch (step) {
            case Constants.STATUS_BOOKING:
                return require('../../../../../assets/icons/ic_calendar.png');
            case Constants.STATUS_CONFIRM:
                return require('../../../../../assets/icons/ic_airport_car.png');
            default:
            case Constants.STATUS_COMPLETE:
                return require('../../../../../assets/icons/ic_home.png');
        }
    };

    tripStatusTitle = (step) => {
        switch (step) {
            case Constants.STATUS_BOOKING:
                return Strings('label.booked');
            case Constants.STATUS_CONFIRM:
                return Strings('label.assigned');
            default:
            case Constants.STATUS_COMPLETE:
                return Strings('label.completed');
        }
    };

    tripStatusStep = (step, isReached) => (
        <View style={{ alignItems: 'center' }}>
            <Image
                source={this.tripStatusImage(step)}
                style={[styles.statusStepImage, (isReached) ? styles.statusStepImageReached : styles.statusStepImageUnreached]}
            />
            <AppText
                style={[styles.statusStepTitle, (isReached) ? styles.statusStepTitleReached : styles.statusStepTitleUnreached]}
            >
                {this.tripStatusTitle(step)}
            </AppText>
        </View>
    );

    tripStatusSeparator = (isReached) => (
        <View
            style={{
                height: 1,
                flex: 1,
                backgroundColor: isReached ? Colors.COLOR_PRIMARY_1 : Colors.COLOR_NEUTRAL_3,
                marginHorizontal: normalize(16),
            }}
        />
    );

    renderTripStatus() {
        const type = this.getTripType();

        return (
            <View style={styles.tripStatus}>
                {this.tripStatusStep(Constants.STATUS_BOOKING, true)}
                {this.tripStatusSeparator(type >= 1)}
                {this.tripStatusStep(Constants.STATUS_CONFIRM, type >= 1)}
                {this.tripStatusSeparator(type >= 2)}
                {this.tripStatusStep(Constants.STATUS_COMPLETE, type >= 2)}
            </View>
        );
    }

    informationView = (icon, value, isSubInformation = false, action, actionOnPress) => (value) ? (
        <View style={{ flexDirection: 'row', marginVertical: normalize(8) }}>
            <Image
                style={styles.informationViewImage}
                source={icon}
            />
            <AppText
                style={{
                    marginLeft: normalize(16),
                    color: isSubInformation ? Colors.COLOR_NEUTRAL_3 : Colors.COLOR_NEUTRAL_1,
                    fontSize: normalize(16),
                    flex: 1,
                }}
            >
                {value}
            </AppText>
            {renderIf(action, (
                <TouchableOpacity onPress={actionOnPress}>
                    <AppText style={styles.informationViewText}>
                        {action}
                    </AppText>
                </TouchableOpacity>
            ))}
        </View>
    ) : <View />;

    renderDriverInformation() {
        const { data } = this.state;
        const name = data && data.driver ? data.driver.name : '';
        const phone = data && data.driver ? data.driver.phoneNumber : '';
        const vehicleDetail = data ? data.vehicle_detail : '';
        const vehicleLicense = data ? data.vehicle_license : '';

        return data && data.driver ? (
            <Collapsible
                style={{ marginTop: normalize(24) }}
                title={Strings('label.driver_information')}
            >
                <View style={[styles.card, { marginTop: normalize(8) }]}>
                    {this.informationView(require('../../../../../assets/icons/ic_steering_wheel.png'), name)}
                    {this.informationView(require('../../../../../assets/icons/ic_phone.png'), phone, false,
                        Strings('label.call'), () => Utils.makePhoneCall(phone))}
                    {this.informationView(require('../../../../../assets/icons/ic_license_plate.png'), vehicleLicense, true)}
                    {this.informationView(require('../../../../../assets/icons/ic_detail.png'), vehicleDetail, true)}
                </View>
            </Collapsible>
        ) : <View />;
    }

    renderRouteInformation() {
        const { data } = this.state;
        const { routeInformation } = this.props;

        return renderIf(data, (
            <Collapsible
                style={{ marginTop: normalize(24) }}
                title={Strings('label.information_booking')}
            >
                <View style={[styles.card, { marginTop: normalize(8) }]}>
                    {
                        routeInformation(data)
                            .map(({ icon, label, emphasize }) => this.informationView(icon, label, !emphasize))
                    }
                </View>
            </Collapsible>
        ));
    }

    renderBookingContactInformation() {
        const { bookingContact } = this.props;
        const { data } = this.state;

        return renderIf(data, (
            <Collapsible
                style={{ marginTop: normalize(24) }}
                title={Strings('label.contact_booking')}
            >
                <View style={[styles.card, { marginTop: normalize(8) }]}>
                    {bookingContact(data)
                        .map(({ label, icon, emphasize, rightLabel, rightOnPress }) => {
                            return this.informationView(icon, label, !emphasize, rightLabel, rightOnPress);
                        })}
                </View>
            </Collapsible>
        ));
    }

    getPaymentMethod = (pm) => {
        switch (pm) {
            case 'cash':
                return payWithCash;
            case 'pay_online':
                return payOnline;
            default:
                return debtPayment;
        }
    };

    renderPaymentMethod() {
        const { data } = this.state;
        const paymentMethod = this.getPaymentMethod(data ? data.payment_method : '');
        const { icon } = paymentMethod;
        const label = paymentMethod[`name_${Strings('language')}`];

        return (
            <Collapsible
                style={{ marginTop: normalize(24) }}
                title={Strings('label.payment_method')}
            >
                <View style={[styles.card, { marginTop: normalize(8) }]}>
                    {this.informationView(icon, label)}
                </View>
            </Collapsible>
        );
    }

    price = (label, price, isTotal) => (
        <View style={[styles.priceItemContainer, isTotal ? styles.priceItemContainerTotal : {}]}>
            <AppText style={styles.priceLabel}>{label}</AppText>
            <AppText style={styles.priceValue} bold>{Utils.formatVND(price)}</AppText>
        </View>
    );

    renderPricing() {
        const { data } = this.state;
        const { priceInformation } = this.props;

        return (
            <Collapsible
                style={{ marginVertical: normalize(24) }}
                title={Strings('label.pricing')}
            >
                <View style={[styles.card, { marginTop: normalize(8) }]}>
                    {priceInformation(data).map(({ l, p, t }) => this.price(l, p, t))}
                </View>
            </Collapsible>
        );
    }

    renderButton() {
        const { editTimeNotAvailable } = this.state;
        return renderIf(this.getTripType() < 2,
            (
                <View
                    style={styles.buttonContainer}
                >
                    <AppButton
                        containerStyle={{ flex: 1 }}
                        disabled={!!editTimeNotAvailable}
                        onPress={() => this.changeBookingTime()}
                        text={Strings('label.change_booking_info')}
                    />
                    {renderIf(editTimeNotAvailable,
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    updateTimeInstructionDialogVisible: true,
                                });
                            }}
                        >
                            <Image
                                source={require('../../../../../assets/icons/ic_info.png')}
                                style={{
                                    width: normalize(20),
                                    height: normalize(20),
                                    alignSelf: 'center',
                                    marginLeft: normalize(16),
                                    tintColor: Colors.COLOR_PRIMARY_1,
                                }}
                            />
                        </TouchableOpacity>)}

                </View>
            ),
        );
    }

    renderLoading() {
        const { loading } = this.state;
        return (
            <AppDialog
                onClose={() => {
                    this.setState({ loading: true });
                }}
                visible={!!(loading)}
                backgroundColor={Colors.COLOR_GREY_TRANSPARENT}
            >
                <Spinner
                    size={30}
                    type="Wave"
                    color={Colors.COLOR_PRIMARY_1}
                    isVisible
                    style={{ alignSelf: 'center' }}
                />
            </AppDialog>
        );
    }

    renderUpdateTimeInstructionDialog() {
        const { updateTimeInstructionDialogVisible } = this.state;

        return (
            <UpdateTimeInstruction
                visible={updateTimeInstructionDialogVisible}
                onPress={() => {
                    this.makePhoneCallForSupport();
                }}
                onClose={() => {
                    this.setState({ updateTimeInstructionDialogVisible: false });
                }}
            />
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <AppContainer
                    style={{ paddingBottom: 0 }}
                    header={this.renderHeader()}
                >
                    <View style={{ flex: 1 }}>
                        <ScrollView style={{ flex: 1 }}>
                            {this.renderTripStatus()}
                            {this.renderDriverInformation()}
                            {this.renderRouteInformation()}
                            {this.renderBookingContactInformation()}
                            {this.renderPaymentMethod()}
                            {this.renderPricing()}
                        </ScrollView>
                    </View>
                </AppContainer>
                {this.renderButton()}
                {this.renderLoading()}
                {this.renderUpdateTimeInstructionDialog()}
            </View>
        );
    }

    makePhoneCallForSupport(message) {
        Utils.makePhoneCall(Constants.HOTLINE_PHONE, (r) => {
            console.log(r);
        });
    }

    /**
     * @returns 2: complete, 1: assigned, 0: booking
     */
    getTripType() {
        const { data } = this.state;
        if (data && data.time_complete) {
            return 2;
        }
        if (data && data.driver) {
            return 1;
        }
        return 0;
    }

    updateTripInformation(serial) {
        const updateDataRequest = {
            serial,
        };
        this.setState({ loading: true }, () => {
            ApiHelper.post(Constants.GET_TRIP_DETAIL, updateDataRequest)
                .then(({ data }) => {
                    console.log('get trip info', data);
                    this.setState({ loading: false, data: data.trip });
                })
                .catch((error) => {
                    console.log('get trip info error', error);
                    this.setState({ loading: false });
                });
        });
        console.log('serial', serial);
    }

    changeBookingTime() {
        const { data } = this.state;
        const { navigation } = this.props;
        const extraPriceSupplier = data ? data.extra_price_supplier : 0;
        const totalPrice = data ? data.price : 0;
        const vehicle = data ? data.vehicle_type : '';
        const airport = data ? data.airport_symbol : '';

        navigation.navigate('ChangeBookingTime', {
            time: data.time_leave,
            tripId: data.id_trip,
            serial: data.serial,
            extraPriceSupplier,
            totalPrice,
            vehicle,
            airport,
            updateCallback: (serial) => this.updateTripInformation(serial),
        });
    }
}

export function UPRideDetail({ navigation }) {
    const routeInformation = (data) => {
        const isFromAirport = (data) ? !data.is_to_airport : false;
        const fromIcon = isFromAirport
            ? require('../../../../../assets/icons/ic_flight_land.png')
            : require('../../../../../assets/icons/ic_home.png');
        const toIcon = isFromAirport
            ? require('../../../../../assets/icons/ic_home.png')
            : require('../../../../../assets/icons/ic_flight_takeoff.png');

        const fromLabel = (data) ? data.name_leave : '';
        const toLabel = (data) ? data.name_arrive : '';

        const timeLeaveMoment = data ? moment(data.time_leave, 'HH:mm - DD/MM/YYYY') : '';
        const timeLeave = data ? Utils.formatDate(timeLeaveMoment.toDate(), 'HH:mm - ddd, DD MMM YYYY') : '';

        const vehicleType = data ? data.vehicle_type : '';
        const vehicle = (data)
            ? `${vehicleType.toUpperCase()} - ${Strings('label.maximum')} ${Utils.getSeat(vehicleType)} ${Strings('label.passenger')}` : '';
        return [
            { icon: fromIcon, label: fromLabel, emphasize: true },
            { icon: toIcon, label: toLabel, emphasize: true },
            { icon: require('../../../../../assets/icons/ic_bxs_time.png'), label: timeLeave, emphasize: false },
            { icon: require('../../../../../assets/icons/ic_airport_car.png'), label: vehicle, emphasize: false },
        ];
    };

    const bookingContactInformation = (data) => {
        const passengerName = data ? data.name_customer : '';
        const phone = data ? data.phone_passenger : '';
        const flightCode = data ? data.flight_code : '';
        const note = data ? data.note_of_salepoint : '';

        return [
            { icon: require('../../../../../assets/icons/ic_user.png'), label: passengerName, emphasize: true },
            {
                icon: require('../../../../../assets/icons/ic_phone.png'),
                label: phone,
                emphasize: true,
                rightLabel: Strings('label.call'),
                rightOnPress: () => Utils.makePhoneCall(phone),
            },
            { icon: require('../../../../../assets/icons/ic_ticket.png'), label: flightCode, emphasize: false },
            { icon: require('../../../../../assets/icons/ic_note.png'), label: note, emphasize: false },

        ];
    };

    const priceInformation = (data) => {
        const systemPrice = data ? data.system_price : 0;
        const extraPriceSupplier = data ? data.extra_price_supplier : 0;
        const hostCommission = data ? data.price_salepoint : 0;
        const totalPrice = data ? data.price : 0;

        return [
            { l: Strings('label.system_price'), p: systemPrice, t: false },
            { l: Strings('label.my_commission'), p: hostCommission, t: false },
            { l: Strings('label.supplier_extra_price'), p: extraPriceSupplier, t: false },
            { l: Strings('label.total'), p: totalPrice, t: false },
        ];
    };

    return (
        <BookingDetail
            navigation={navigation}
            routeInformation={(data) => routeInformation(data)}
            bookingContact={(data) => bookingContactInformation(data)}
            priceInformation={(data) => priceInformation(data)}
        />
    );
}

export function CRRideDetail({ navigation }) {
    const routeInformation = (data) => {
        const nameLeave = data ? data.name_leave : '';
        const timeLeaveMoment = data ? moment(data.time_leave, 'HH:mm - DD/MM/YYYY') : '';
        const timeLeave = data ? Utils.formatDate(timeLeaveMoment.toDate(), 'HH:mm - ddd, DD MMM YYYY') : '';
        const duration = data ? Constants.DURATION.find((d) => d.request === data.carrental_type) : '';

        const vehicleType = data ? data.vehicle_type : '';
        const vehicle = (data)
            ? `${vehicleType.toUpperCase()} - ${Strings('label.maximum')} ${Utils.getSeat(vehicleType)} ${Strings('label.passenger')}` : '';

        return [
            { icon: require('../../../../../assets/icons/ic_home.png'), label: nameLeave, emphasize: true },
            {
                icon: require('../../../../../assets/icons/ic_location_car_rental.png'),
                label: Strings(duration.title),
                emphasize: false,
            },
            { icon: require('../../../../../assets/icons/ic_bxs_time.png'), label: timeLeave, emphasize: false },
            { icon: require('../../../../../assets/icons/ic_airport_car.png'), label: vehicle, emphasize: false },
        ];
    };

    const bookingContactInformation = (data) => {
        const passengerName = data ? data.name_customer : '';
        const phone = data ? data.phone_passenger : '';
        const note = data ? data.note_of_salepoint : '';

        return [
            { icon: require('../../../../../assets/icons/ic_user.png'), label: passengerName, emphasize: true },
            {
                icon: require('../../../../../assets/icons/ic_phone.png'),
                label: phone,
                emphasize: true,
                rightLabel: Strings('label.call'),
                rightOnPress: () => Utils.makePhoneCall(phone),
            },
            { icon: require('../../../../../assets/icons/ic_note.png'), label: note, emphasize: false },
        ];
    };

    const priceInformation = (data) => {
        const systemPrice = data ? data.system_price : 0;
        const hostCommission = data ? data.price_salepoint : 0;
        const totalPrice = data ? data.price : 0;

        return [
            { l: Strings('label.system_price'), p: systemPrice, t: false },
            { l: Strings('label.my_commission'), p: hostCommission, t: false },
            { l: Strings('label.total'), p: totalPrice, t: false },
        ];
    };

    return (
        <BookingDetail
            navigation={navigation}
            routeInformation={(data) => routeInformation(data)}
            bookingContact={(data) => bookingContactInformation(data)}
            priceInformation={(data) => priceInformation(data)}
        />
    );
}
