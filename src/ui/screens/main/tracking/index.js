import React, { Component } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { firebase } from '@react-native-firebase/messaging';
import { Navigation, Utils } from '../../../../commons';
import AppText from '../../../components/text/AppTextView';
import Strings from '../../../../utils/LocalizationConfig';
import styles from './styles';
import Map from './map';
import renderIf, { normalize } from '../../../../commons/utils';
import PermissionRequired from './subscreens/PermissionRequired';
import { AnimationLoading } from '../../../components/loading';
import RideSummaryInformation from './common/RideSummaryInformation';
import NoResult from './subscreens/NoResult';
import RideComplete from './subscreens/RideComplete';
import AppContainer from '../../../components/container';
import AppDialog from '../../../components/dialog/AppDialog';
import moment from 'moment';

function rideStillAvailable(activeRides, ride) {
    if (!ride) return null;
    return activeRides.find((r) => r.id_trip === ride.id_trip);
}

export default class TrackingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingFirstEntrance: false,
            selectedRide: null,
            hasPermission: true,
            storeActionType: '',
            trackingRideIsComplete: false,
            loading: false,
        };
    }

    componentDidMount() {
        this.checkPermission(
            () => this.showFirstEntranceLoading(true,
                () => this.fetchActiveRides()),
        );
    }

    renderHeader() {
        return (
            <View
                style={styles.header}
            >
                <AppText
                    bold
                    style={styles.headerTitle}
                >
                    {Strings('header.route_tracking')}
                </AppText>
            </View>
        );
    }

    renderMap() {
        const ride = this.getTrackingRide();
        return (
            <View style={{ flex: 1 }}>
                <Map
                    ride={ride}
                />
            </View>
        );
    }

    renderRideInformation() {
        const ride = this.getTrackingRide();
        const { navigation } = this.props;

        return (
            <View
                style={styles.rideInformationContainer}
            >
                <RideSummaryInformation
                    onPress={() => {
                        navigation.navigate('ActiveRide', {
                            selectedRide: ride,
                            selectRideCallback: (r) => {
                                this.rideSelectFromList(r);
                            },
                        });
                    }}
                    ride={ride}
                    rightButtonVisible
                />
            </View>
        );
    }

    renderDriverInformation() {
        const ride = this.getTrackingRide();
        const driver = ride ? ride.driver : null;

        const timeLeave = ride ? ride.time_leave : '';
        const duration = ride ? ride.duration : 0;

        const driverName = driver ? driver.name : '';
        const phoneNumber = driver ? driver.phoneNumber : '';

        const estimate = moment(timeLeave, 'HH:mm - DD/MM/YYYY').add(duration, 'seconds');

        return (
            <View style={styles.driverInformation}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <AppText style={styles.driverName}>{driverName}</AppText>
                        <AppText style={styles.drivePhone}>{phoneNumber}</AppText>
                    </View>
                    <TouchableOpacity
                        disabled={!phoneNumber}
                        onPress={() => Utils.makePhoneCall(phoneNumber)}
                    >
                        <Image
                            source={require('../../../../assets/icons/ic_call_green.png')}
                            style={{ width: normalize(40), height: normalize(40) }}
                        />
                    </TouchableOpacity>
                </View>
                <AppText
                    style={styles.driverEstimatePickupTime}
                >
                    {`${Strings('label.estimate_pick_up_time')} ${estimate.format('HH:mm')}`}
                </AppText>
                <View style={styles.detailBookingContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            this.goToDetail();
                        }}
                    >
                        <AppText style={styles.detailBooking}>{Strings('label.detail_booking')}</AppText>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    renderPermissionView = (hasPermission) => renderIf(!hasPermission,
        <PermissionRequired />);

    renderNoRideView = () => (
        <NoResult
            onPress={() => {
                this.showFirstEntranceLoading(true, () => this.fetchActiveRides());
            }}
        />
    );

    renderTrackingTripIsCompleteView() {
        const { navigation } = this.props;

        return (
            <RideComplete
                onPress={() => {
                    navigation.navigate('ActiveRide', {
                        selectRideCallback: (r) => {
                            this.rideSelectFromList(r);
                        },
                    });
                }}
            />
        );
    }

    renderFirstLoadingView() {
        const { loadingFirstEntrance } = this.state;
        return loadingFirstEntrance ? (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <AnimationLoading
                    style={{ width: normalize(80), height: normalize(80), alignSelf: 'center' }}
                />
            </View>
        ) : <View />;
    }

    renderRideTrackingView() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderMap()}
                {this.renderRideInformation()}
                {this.renderDriverInformation()}
            </View>
        );
    }

    renderTrackingView() {
        const { loadingFirstEntrance, trackingRideIsComplete } = this.state;

        if (!loadingFirstEntrance) {
            if (trackingRideIsComplete) {
                return this.renderTrackingTripIsCompleteView();
            }

            if (this.getTrackingRide()) {
                return this.renderRideTrackingView();
            }
            return this.renderNoRideView();
        }
        return this.renderFirstLoadingView();
    }

    renderLoadingView() {
        const { loading } = this.state;
        return renderIf(loading,
            <AppDialog
                onClose={() => {
                }}
                visible={loading}
                disableSwipeDown
            >
                <AnimationLoading
                    style={{ width: normalize(80), height: normalize(80), alignSelf: 'center' }}
                />
            </AppDialog>);
    }

    render() {
        const { hasPermission } = this.state;
        return (
            <AppContainer
                header={this.renderHeader()}
                style={{ flex: 1, padding: 0 }}
            >
                {this.renderPermissionView(hasPermission)}
                {renderIf(hasPermission, this.renderTrackingView())}
                {renderIf(hasPermission, this.renderLoadingView())}
            </AppContainer>
        );
    }

    checkPermission(nextStep) {
        firebase.messaging().hasPermission()
            .then((enable) => {
                this.setState({ hasPermission: enable });
                setTimeout(() => {
                    if (nextStep) {
                        nextStep();
                    }
                }, 300);
            });
    }

    goToDetail() {
        const { navigation } = this.props;
        navigation.navigate(Navigation.detailRouteName(this.getTrackingRide()), {
            data: this.getTrackingRide(),
        });
    }

    receiveRideCompleteNotificationCallback() {
        console.log('receiveRideCompleteNotificationCallback');
        this.setState({
            trackingRideIsComplete: true,
        });
    }

    requestListenToDriverLocation(ride) {
        const { fcmToken } = this.props;
        let data = {
            firebaseToken: fcmToken,
            tripId: ride.id_trip,
        };
        const { trackRide } = this.props;
        trackRide(data, () => this.receiveRideCompleteNotificationCallback());
    }

    rideSelectFromList(ride) {
        this.setState({ selectedRide: ride, trackingRideIsComplete: false }, () => {
            this.requestListenToDriverLocation(ride);
        });
    }

    fetchActiveRides(firstLoad) {
        const { fetchRiding } = this.props;
        fetchRiding(({ success, data }) => {
            if (success) {
                this.showFirstEntranceLoading(false);
                setTimeout(() => {
                    if (this.getTrackingRide()) {
                        this.requestListenToDriverLocation(this.getTrackingRide());
                    }
                }, 300);
            } else {
                // fetch error
            }
        });
    }

    showFirstEntranceLoading(visible, callback) {
        this.setState({ loadingFirstEntrance: visible });
        setTimeout(() => {
            if (callback) {
                callback();
            }
        }, 300);
    }

    rideStillAvailable(ride) {
        if (!ride) return null;

        const { activeRides } = this.props;
        return activeRides.find((r) => r.id_trip === ride.id_trip);
    }

    /**
     * Priority:
     * 1. Selected - get from state
     * 2. If selected is null - get from asyncstorage & check if that trip is still available
     * 3. Finally, get the first item from the fetched list
     */
    getTrackingRide() {
        const { selectedRide } = this.state;
        const { activeRides } = this.props;
        return this.rideStillAvailable(selectedRide) || activeRides[0];
    }
};
