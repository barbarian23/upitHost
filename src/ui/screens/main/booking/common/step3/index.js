import React, { Component } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Image, KeyboardAvoidingView, TouchableOpacity, View } from 'react-native';
import { Colors, Constants, Dimens, Utils } from '../../../../../../commons';
import renderIf, { normalize } from '../../../../../../commons/utils';
import AppText from '../../../../../components/text/AppTextView';
import Strings from '../../../../../../utils/LocalizationConfig';
import AppButton from '../../../../../components/button/AppButton';
import styles from './styles';
import BookingInput from '../../../../../components/form/BookingInput';
import { payWithCash, ROUTE_FROM_AIRPORT } from '../../../../../../commons/const';
import InstructionDialog from './instruction';
import BookingDialog, { BookingDialogState } from './bookingdialog';

export default class AirportCarStep3 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payment: null,
            commission: 0,
            route: ROUTE_FROM_AIRPORT,
            instructionVisible: false,

            bookingRequestDialog: null,
            priceError: '',

            bookingErrorMessage: '',
            bookingErrorCode: null,

            extraPrice: 0,
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        const bookingInfo = Utils.getAllParamFromNavigation(navigation);
        this.setState({ ...bookingInfo });
    }

    sectionTitle = (title) => <AppText style={styles.sectionTitle}>{title}</AppText>;

    sectionDescription = (description) => renderIf(description,
        <AppText style={styles.sectionDescription}>{description}</AppText>);

    routeTime = (date, time) => {
        if (!date || !time) return '';
        const dateString = Utils.formatDate(date, 'ddd, DD MMM YYYY');
        const timeString = Utils.formatDate(time, 'HH:mm');
        return `${timeString} - ${dateString}`;
    };

    editRouteInformationParams = () => {
        const { editRouteParams, editPassengerParams } = this.props;
        const data = { ...editPassengerParams(this.state), ...editRouteParams(this.state) };
        return {
            ...data,
            editCallback: (d) => this.editCallback(d),
        };
    };

    editCallback(data) {
        const { routeInformationHaveChange } = this.props;
        const { state } = this;
        const { commission } = this.state;
        this.setState({
            ...data,
            commission: routeInformationHaveChange(state, data) ? 0 : commission,
        });
    }

    renderRouteInformationSection() {
        const { routeTitle } = this.props;

        const { airport, location, route } = this.state;

        return (
            <View>
                <View style={styles.sectionLabelContainer}>
                    <AppText style={styles.sectionLabel}>{Strings('label.information_booking')}</AppText>
                    <TouchableOpacity
                        onPress={() => this.navigateToStep1()}
                    >
                        <AppText style={styles.edit}>{Strings('label.edit')}</AppText>
                    </TouchableOpacity>
                </View>
                <View style={styles.sectionContent}>
                    {this.sectionTitle(routeTitle({ location, airport, route }))}
                    {this.renderRouteDescriptionFields()}
                </View>
            </View>
        );
    }

    renderRouteDescriptionFields() {
        const { navigation, routeDescription } = this.props;
        const { date, time, duration } = this.state;
        const { vehicle } = this.state;
        const descriptions = routeDescription({ date, time, vehicle, duration });

        return (
            <View>
                {descriptions.map((information) => this.sectionDescription(information))}
            </View>
        );
    }

    passengerContact = (name, phone) => (
        (phone) ? `${name} - ${phone}` : `${name}`
    );

    editPassengerInformationCallback(data) {
        this.setState({
            ...data,
        });
    }

    editPassengerInformationParams() {
        const { editPassengerParams } = this.props;
        return {
            ...editPassengerParams(this.state),
            callback: (data) => this.editPassengerInformationCallback(data),
        };
    }

    renderPassengerInformationSection() {
        const { passengerName, passengerPhoneNumber } = this.state;
        const { noteForDriver } = this.state;
        const { flightCode } = this.state;
        const { navigation, step2Route } = this.props;

        const contact = this.passengerContact(passengerName, passengerPhoneNumber);

        return (
            <View style={styles.passengerInformationSection}>
                <View style={styles.sectionLabelContainer}>
                    <AppText style={styles.sectionLabel}>{Strings('label.contact_booking')}</AppText>
                    <TouchableOpacity
                        onPress={() => navigation.push(step2Route, this.editPassengerInformationParams())}
                    >
                        <AppText style={styles.edit}>{Strings('label.edit')}</AppText>
                    </TouchableOpacity>
                </View>
                <View style={styles.sectionContent}>
                    {this.sectionTitle(contact)}
                    {this.sectionDescription(flightCode)}
                    {this.sectionDescription(noteForDriver)}
                </View>
            </View>
        );
    }

    renderPaymentMethodSection() {
        const { navigation } = this.props;
        const selectedPayment = this.getPaymentMethod();

        return (
            <View style={styles.paymentMethodSection}>
                <View style={styles.sectionLabelContainer}>
                    <AppText style={styles.sectionLabel}>{Strings('label.payment_method')}</AppText>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('PaymentPicker', {
                            payment: this.getPaymentMethod(),
                            callback: (payment) => this.paymentMethodSelect(payment),
                        })}
                    >
                        <AppText style={styles.edit}>{Strings('label.change')}</AppText>
                    </TouchableOpacity>
                </View>
                <View style={styles.paymentMethodContent}>
                    <Image
                        style={styles.paymentMethodImage}
                        source={selectedPayment.icon}
                    />
                    <AppText
                        style={[styles.sectionTitle, { marginLeft: normalize(16) }]}
                    >
                        {selectedPayment[`name_${Strings('language')}`]}
                    </AppText>
                </View>
            </View>
        );
    }

    systemPrice = (price) => (
        <View style={styles.systemPrice}>
            <AppText style={styles.commonPriceLabel}>{Strings('label.system_price')}</AppText>
            <AppText bold style={styles.systemPriceValue}>{Utils.formatVND(price)}</AppText>
        </View>
    );

    commission = (commission) => (
        <View style={styles.commission}>
            <AppText style={styles.commonPriceLabel}>{`+ ${Strings('label.my_commission')}`}</AppText>
            <BookingInput
                maxLength={10}
                value={commission < 0 ? '0' : Utils.formatDotSeparateNumber(commission)}
                containerStyle={{ flex: 1 }}
                inputContainer={{ paddingVertical: 0 }}
                rightLabel="₫"
                inputStyle={{ textAlign: 'right', fontFamily: Constants.DEFAULT_FONT_BOLD }}
                onChangeText={(text) => this.validateCommission(text)}
                keyboardType="decimal-pad"
            />
        </View>
    );

    supplierExtraPrice = (price) => (renderIf(price > 0,
        <View style={styles.commission}>
            <AppText style={styles.commonPriceLabel}>{`+ ${Strings('label.supplier_extra_price')}`}</AppText>
            <AppText bold style={styles.systemPriceValue}>{Utils.formatVND(price)}</AppText>
        </View>));

    totalPrice = (price, priceError) => {
        return (
            <View>
                <View style={styles.totalPrice}>
                    <View style={{ flex: 1 }}>
                        <AppText style={styles.commonPriceLabel}>=</AppText>
                    </View>
                    <BookingInput
                        maxLength={10}
                        value={Utils.formatDotSeparateNumber(price)}
                        containerStyle={{ flex: 1 }}
                        inputContainer={{ paddingVertical: 0 }}
                        rightLabel="₫"
                        inputStyle={styles.totalPriceInput(this.isTotalPriceValid())}
                        onChangeText={(text) => this.validateTotalPrice(text)}
                        keyboardType="decimal-pad"
                    />
                </View>
                {renderIf(priceError,
                    <AppText
                        style={{ color: Colors.COLOR_SEMATIC_4, fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY) }}
                        bold
                    >
                        {`* ${priceError}`}
                    </AppText>)}
            </View>
        );
    };

    renderPriceSection() {
        const { navigation } = this.props;
        const { commission, priceError } = this.state;
        const { service } = Utils.getAllParamFromNavigation(navigation);
        const renderSupplierExtraPrice = (service !== 'CR');

        return (
            <View style={styles.priceSection}>
                <View style={styles.sectionLabelContainer}>
                    <AppText style={styles.sectionLabel}>{Strings('label.pricing')}</AppText>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ instructionVisible: true });
                        }}
                    >
                        <AppText style={styles.edit}>{Strings('label.info')}</AppText>
                    </TouchableOpacity>
                </View>
                <View style={styles.sectionContent}>
                    {this.systemPrice(this.getSystemPrice())}
                    {this.commission(commission)}
                    {renderSupplierExtraPrice ? this.supplierExtraPrice(this.getSupplierExtraPrice()) : <View />}
                    {this.totalPrice(this.getTotalPrice(), priceError)}
                </View>
            </View>
        );
    }

    renderBookConfirmSection() {
        const { priceError } = this.state;
        const { commission } = this.state;
        const errorVisible = commission < 0 || !!priceError;
        const totalPrice = (!this.isTotalPriceValid()) ? '' : Utils.formatVND(this.getTotalPrice());

        return (
            <View style={styles.bookConfirmContainer}>
                <View style={{ flexDirection: 'row' }}>
                    <AppText style={styles.total}>{Strings('label.total')}</AppText>
                    <AppText style={styles.totalValue}>{totalPrice}</AppText>
                </View>
                <AppButton
                    disabled={errorVisible}
                    onPress={() => this.startBookingRequestProcess()}
                    text={Strings('label.book_now')}
                    containerStyle={{ marginTop: normalize(16) }}
                />
            </View>
        );
    }

    renderInstructionSection() {
        const { instructionVisible } = this.state;
        const totalPrice = this.getPriceObject();

        return (
            <InstructionDialog
                onClose={() => {
                    this.setState({ instructionVisible: false });
                }}
                visible={instructionVisible}
                maxExtraPriceSalepoint={totalPrice ? totalPrice.maxExtraPriceSalepoint : null}
            />
        );
    }

    requestBooking() {
        const { requestBookingService } = this.props;
        const params = this.bookTripRequestData();

        this.setState({ bookingRequestDialog: BookingDialogState.LOADING }, () => {
            requestBookingService(params).then(({ data }) => {
                console.log('Booking success data', data);
                this.setState({ bookingRequestDialog: BookingDialogState.SUCCESS });
            }).catch((error) => {
                console.log('error', error);
                if (error && error.messages) {
                    if (error.messages.code === 'TIME_LEAVE_ERROR_PLEASE_CALL_SUPPORTER') {
                        this.setState({
                            bookingErrorMessage: error.messages.message,
                            bookingErrorCode: error.messages.code,
                            bookingRequestDialog: BookingDialogState.FAILED,
                        });
                    } else {
                        this.setState({ bookingRequestDialog: BookingDialogState.FAILED });
                    }
                } else {
                    this.setState({ bookingRequestDialog: BookingDialogState.FAILED });
                }
            });
        });
    }

    closeBookingProcessDialog() {
        this.setState({
            bookingRequestDialog: null,
            bookingErrorMessage: '',
            bookingErrorCode: null,
        });
    }

    renderBookingProcessDialog() {
        const {
            bookingRequestDialog,
            bookingErrorMessage,
            bookingErrorCode,
        } = this.state;

        return (
            <BookingDialog
                onClose={() => this.closeBookingProcessDialog()}
                visible={bookingRequestDialog}
                onConfirm={() => this.requestBooking()}
                onSuccessGoToStatus={() => this.goToStatusScreen()}
                onSuccessGoToHome={() => this.goToBookingHomeScreen()}
                error={{
                    code: bookingErrorCode,
                    message: bookingErrorMessage,
                }}
            />
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>

                <KeyboardAvoidingView
                    behavior="padding"
                    style={{ flex: 1, paddingBottom: normalize(40) }}
                >
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps="handled"
                        style={styles.container}
                    >
                        {this.renderRouteInformationSection()}
                        {this.renderPassengerInformationSection()}
                        {this.renderPaymentMethodSection()}
                        {this.renderPriceSection()}
                    </KeyboardAwareScrollView>
                </KeyboardAvoidingView>
                {this.renderBookConfirmSection()}
                {this.renderInstructionSection()}
                {this.renderBookingProcessDialog()}
            </View>
        );
    }

    navigateToStep1() {
        const { navigation, step1Route } = this.props;
        navigation.push(step1Route, this.editRouteInformationParams());
    }

    isTotalPriceValid = () => (this.getSystemPrice() + this.getSupplierExtraPrice()) <= this.getTotalPrice();

    validateCommission(text) {
        const service = this.getService();
        if (service === 'UP') {
            this.validateCommissionUP(text);
        } else {
            this.validateCommissionCR(text);
        }
    }

    validateCommissionCR(text) {
        if (!text || text.length === 0) {
            this.setState({
                commission: 0,
            });
        } else {
            text = text.split('.').join('');
            const commissionValue = parseInt(text, 10);

            this.setState({
                commission: commissionValue,
                priceError: '',
            });
        }
    }

    validateCommissionUP(text) {
        if (!text || text.length === 0) {
            this.setState({
                commission: 0,
            });
        } else {
            text = text.split('.').join('');
            const commissionValue = parseInt(text, 10);

            const { maxExtraPriceSalepoint } = this.getPriceObject();
            if (commissionValue > maxExtraPriceSalepoint) {
                this.setState({
                    commission: maxExtraPriceSalepoint,
                }, () => {
                    Utils.showToast(`${Strings('message.max_commission_in_this_trip')}${Utils.formatVND(maxExtraPriceSalepoint)}`);
                });
            } else {
                this.setState({
                    commission: commissionValue,
                    priceError: '',
                });
            }
        }
    }

    validateTotalPrice = (text) => {
        const service = this.getService();
        if (service === 'CR') {
            this.validatePriceCR(text);
        } else {
            this.validatePriceUP(text);
        }
    };

    validatePriceCR(text) {
        const systemPrice = this.getSystemPrice();

        if (!text || text.length === 0) {
            // In order to display zero at total price edit field when this field is edited
            const commission = 0 - systemPrice;

            this.setState({
                commission,
                priceError: `${Strings('label.total_price_error_cr')} ${Utils.formatVND(systemPrice)}`,
            });
        } else {
            text = text.split('.').join('');
            const totalValue = parseInt(text, 10);
            this.setState({
                commission: this.calculateCRHostCommissionFromTotalPrice(totalValue),
                priceError: '',
            });
        }
    }

    validatePriceUP(text) {
        const { extraPrice } = this.state;
        // const supplierExtraPrice = extraPrice.extra_price_supplier;

        const priceObject = this.getPriceObject();
        const { maxExtraPriceSalepoint } = priceObject;
        const systemPrice = this.getSystemPrice();

        const minTotalPrice = systemPrice;
        const maxTotalPrice = systemPrice + maxExtraPriceSalepoint;

        if (!text || text.length === 0) {
            // In order to display zero at total price edit field when this field is edited
            const commission = 0 - systemPrice - extraPrice;

            this.setState({
                commission,
                priceError: `${Strings('label.total_price_error')} ${Utils.formatVND(minTotalPrice)} & ${Utils.formatVND(maxTotalPrice)}`,
            });
        } else {
            text = text.split('.').join('');
            const totalValue = parseInt(text, 10);

            if (totalValue > maxTotalPrice) {
                this.setState({
                    commission: maxExtraPriceSalepoint,
                    priceError: '',
                });
            } else {
                this.setState({
                    commission: this.calculateHostCommissionFromTotalPrice(totalValue),
                    priceError: '',
                });
            }
        }
    }

    calculateCRHostCommissionFromTotalPrice = (price) => {
        const systemPrice = this.getSystemPrice();
        return price - systemPrice;
    };

    calculateHostCommissionFromTotalPrice = (price) => {
        const { extraPrice } = this.state;
        const systemPrice = this.getSystemPrice();
        return price - systemPrice - extraPrice;
    };

    goToStatusScreen() {
        const { navigation } = this.props;
        this.closeBookingProcessDialog();
        setTimeout(() => {
            navigation.navigate('Status');
        }, 400);
    }

    goToBookingHomeScreen() {
        const { navigation } = this.props;
        this.closeBookingProcessDialog();
        setTimeout(() => {
            navigation.navigate('Booking');
        }, 400);
    }

    bookTripRequestData() {
        const { bookRideRequestData } = this.props;
        const { priceToken } = this.state;
        return bookRideRequestData(this.state, {
            priceToken,
            extraPriceSupplier: this.getSupplierExtraPrice(),
            paymentMethod: this.getPaymentMethod(),
        });
    }

    startBookingRequestProcess() {
        this.setState({
            bookingRequestDialog: BookingDialogState.CONFIRM,
        });
    }

    getService() {
        const { navigation } = this.props;
        return Utils.getParamFromNavigation(navigation, 'service');
    }

    getPriceObject() {
        const { price } = this.state;
        const { route, vehicle } = this.state;

        if (price && vehicle) {
            const service = this.getService();
            if (service === 'CR') {
                return price[vehicle.symbol];
            }
            return price[vehicle.symbol][`${route === ROUTE_FROM_AIRPORT ? 'fromAirport' : 'toAirport'}`];
        }
        return null;
    }

    getSupplierExtraPrice() {
        const { extraPrice } = this.state;
        return extraPrice;
    }

    getSystemPrice() {
        const { vehicle } = this.state;
        const priceObject = this.getPriceObject();

        if (vehicle && priceObject) {
            const { discountPrice, systemPrice } = priceObject;
            return systemPrice - discountPrice;
        }

        return 0;
    }

    getTotalPrice() {
        const { vehicle } = this.state;
        if (vehicle) {
            const { extraPrice } = this.state;
            const { commission } = this.state;
            return this.getSystemPrice() + commission + extraPrice;
        }
        return 0;
    }

    paymentMethodSelect(payment) {
        this.setState({ payment });
    }

    getPaymentMethod = () => {
        const { payment } = this.state;
        return payment || payWithCash;
    };
}
