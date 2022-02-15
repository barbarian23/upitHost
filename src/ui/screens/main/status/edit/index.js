import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import AppContainer from '../../../../components/container';
import AirportBookingHeader from '../../../../components/header/authHeader/AirportBookingHeader';
import Strings from '../../../../../utils/LocalizationConfig';
import AppText from '../../../../components/text/AppTextView';
import styles from './styles';
import renderIf, { normalize } from '../../../../../commons/utils';
import DateTimeField, { DEFAULT_TIME } from '../../booking/common/datetime/DateTimeField';
import { Colors, Styles, Utils } from '../../../../../commons';
import * as ApiStatus from '../../../../../services/apis/ApiStatus';
import BookingDialog, { BookingDialogState, PROGRESS } from '../../booking/common/step3/bookingdialog';
import AppButton from '../../../../components/button/AppButton';
import * as ApiBooking from '../../../../../services/apis/ApiBooking';

class ChangeBookingTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            time: null,
            loading: false,
            updatingRequestDialog: null,
            extraPrice: 0,
        };
    }

    getInitDate = (oldDate) => {
        const currentDate = moment();
        return currentDate.isSameOrBefore(oldDate, 'day') ? oldDate : currentDate;
    };

    componentDidMount() {
        const { navigation } = this.props;
        const { time, extraPriceSupplier } = Utils.getAllParamFromNavigation(navigation);
        const components = time.split(' - ');
        const oldDate = moment(components[1], 'DD/MM/YYYY');

        this.setState({
            date: this.getInitDate(oldDate).toDate(),
            time: null,
            extraPrice: extraPriceSupplier,
        });
    }

    renderHeader() {
        const { navigation } = this.props;

        return (
            <AirportBookingHeader
                navigation={navigation}
                title={Strings('label.change_booking_info')}
            />
        );
    }

    renderUpdateTimeNote() {
        return (
            <View>
                <AppText style={styles.note}>
                    <AppText style={styles.noteLabel}>{`${Strings('label.note')}: `}</AppText>
                    <AppText style={styles.noteContent}>
                        {Strings('label.update_time_note')}
                    </AppText>
                </AppText>
                <AppText style={[styles.note, styles.noteContent]}>
                    {Strings('label.update_time_note_2')}
                </AppText>
            </View>
        );
    }

    renderUpdateForm() {
        const { date, time, timeError, loading } = this.state;

        return (
            <View
                style={{
                    marginTop: normalize(24),
                    padding: normalize(16),
                    backgroundColor: Colors.COLOR_NEUTRAL_6, ...Styles.cardShadowStyle,
                }}
            >
                <DateTimeField
                    loading={loading}
                    date={date}
                    time={time}
                    title={Strings('label.time')}
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
                />
            </View>
        );
    }

    showPricingInfo() {

    }

    price = (label, price, isTotal) => (
        <View style={[styles.priceItemContainer, isTotal ? styles.priceItemContainerTotal : {}]}>
            <AppText style={styles.priceLabel}>{label}</AppText>
            <AppText style={styles.priceValue} bold>{Utils.formatVND(price)}</AppText>
        </View>
    );

    renderPriceChange() {
        const { navigation } = this.props;
        const { totalPrice, extraPriceSupplier } = Utils.getAllParamFromNavigation(navigation);

        const { extraPrice } = this.state;
        const sign = (extraPrice > extraPriceSupplier) ? '+' : '-';
        const changingPrice = Math.abs(extraPrice - extraPriceSupplier);

        return (
            <View>
                <View style={{ flexDirection: 'row', marginTop: normalize(32) }}>
                    <AppText style={styles.pricingTitle}>{Strings('label.pricing')}</AppText>
                    <TouchableOpacity onPress={() => this.showPricingInfo()}>
                        <AppText style={styles.changeCollapsibleStatusButton}>
                            {Strings('label.info')}
                        </AppText>
                    </TouchableOpacity>
                </View>
                <View style={styles.priceChangeSummary}>
                    {this.price(Strings('label.old_label_price'), totalPrice)}
                    {this.price(`${sign} ${Strings('label.supplier_extra_price')}`, changingPrice)}
                    {this.price('=', totalPrice - extraPriceSupplier + extraPrice, true)}
                </View>
            </View>
        );
    }

    renderUpdatingProcessDialog() {
        const { updatingRequestDialog } = this.state;

        return (
            <BookingDialog
                progress={PROGRESS.UPDATE}
                onClose={() => this.closeUpdatingProcessDialog()}
                visible={updatingRequestDialog}
                onConfirm={() => this.requestUpdating()}
                onSuccessGoToStatus={() => this.goToDetailScreen()}
                onSuccessGoToHome={() => this.goToStatusHomeScreen()}
            />
        );
    }

    renderButton(disable) {
        return (
            <View
                style={{
                    paddingVertical: normalize(8),
                    paddingHorizontal: normalize(16),
                    backgroundColor: Colors.COLOR_NEUTRAL_6,
                    ...Styles.cardShadowStyle,
                }}
            >
                <AppButton
                    disabled={disable}
                    onPress={() => this.startUpdatingProcess()}
                    text={Strings('label.change_booking_info')}
                />
            </View>
        );
    }

    render() {
        const { time } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <AppContainer
                    header={this.renderHeader()}
                >
                    {this.renderUpdateTimeNote()}
                    {this.renderUpdateForm()}
                    {renderIf(this.isPriceChange(), this.renderPriceChange())}
                </AppContainer>
                {this.renderButton(!time)}
                {this.renderUpdatingProcessDialog()}
            </View>
        );
    }

    goToDetailScreen() {
        this.setState({
            updatingRequestDialog: null,
        }, () => {
            const { navigation } = this.props;
            const { updateCallback, serial } = Utils.getAllParamFromNavigation(navigation);
            navigation.goBack();
            updateCallback(serial);
        });
    }

    goToStatusHomeScreen() {
        this.setState({
            updatingRequestDialog: null,
        }, () => {
            const { navigation } = this.props;
            navigation.navigate('Status');
        });
    }

    requestUpdating() {
        const { date, time } = this.state;
        const dateString = Utils.formatDate(date, 'DD/MM/YYYY');
        const timeString = Utils.formatDate(time, 'HH : mm');
        const selectedDateTime = Utils.parseDate(`${dateString} ${timeString}`, 'DD/MM/YYYY HH : mm');

        let requestData = {
            time_leave: Utils.formatDate(selectedDateTime, 'YYYY-MM-DD HH:mm:ss'),
            id_trip: this.getTripId(),
        };
        this.setState({ updatingRequestDialog: BookingDialogState.LOADING }, () => {
            ApiStatus.updateTime(requestData)
                .then((data) => {
                    console.log('update time success', data);
                    this.setState({
                        updatingRequestDialog: BookingDialogState.SUCCESS,
                    });
                })
                .catch((error) => {
                    console.log('update time error', error);
                    this.setState({
                        updatingRequestDialog: BookingDialogState.FAILED,
                    });
                });
        });
    }

    startUpdatingProcess() {
        this.setState({
            updatingRequestDialog: BookingDialogState.CONFIRM,
        });
    }

    closeUpdatingProcessDialog() {
        this.setState({
            updatingRequestDialog: null,
        });
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

    requestExtraPriceSuccessCallback(time) {
        console.log('RequestBookingExtraPriceSuccess', time);
        this.setState({
            time: time.toDate(),
        });
    }

    requestExtraPriceErrorCallback({ messages }) {
        console.log('RequestBookingExtraPriceError', messages);
        this.setState({
            timeError: Strings(`server_message.${messages.code}`),
        });
    }

    validateWithServer(selectedDateTime) {
        let requestData = {
            time_leave: Utils.formatDate(selectedDateTime, 'YYYY-MM-DD HH:mm:ss'),
            vehicle_type: this.getVehicle(),
            airport_symbol: this.getAirport(),
        };
        this.setState({ loading: true });
        setTimeout(() => {
            ApiBooking.getExtraPriceSupplier(requestData)
                .then(({ data }) => {
                    const extraPrice = data.extra_price_supplier;
                    this.setState({
                        loading: false,
                        extraPrice,
                        time: selectedDateTime.toDate(),
                    });
                })
                .catch((error) => this.requestExtraPriceErrorCallback(error));
        }, 300);
    }

    getTripId() {
        const { navigation } = this.props;
        const { tripId } = Utils.getAllParamFromNavigation(navigation);
        return tripId;
    }

    isPriceChange() {
        const { navigation } = this.props;
        const { extraPriceSupplier } = Utils.getAllParamFromNavigation(navigation);
        const { extraPrice } = this.state;

        console.log(extraPriceSupplier, extraPrice);
        return extraPriceSupplier !== extraPrice;
    }

    getVehicle = () => {
        const { navigation } = this.props;
        return Utils.getAllParamFromNavigation(navigation).vehicle;
    };

    getAirport = () => {
        const { navigation } = this.props;
        return Utils.getAllParamFromNavigation(navigation).airport;
    };
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(ChangeBookingTime);
