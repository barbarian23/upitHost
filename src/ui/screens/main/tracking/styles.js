import { StyleSheet } from 'react-native';
import { Colors, Constants, Dimens, Styles } from '../../../../commons';
import { normalize } from '../../../../commons/utils';

const styles = StyleSheet.create({
    headerTitle: {
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
    },
    header: {
        paddingVertical: normalize(16),
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rideInformationTextPartContainer: {
        marginLeft: normalize(16),
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
    },
    rideInformationSerial: {
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
        fontFamily: Constants.DEFAULT_FONT_REGULAR,
        color: Colors.COLOR_LIGHT_BLUE,
    },
    rideInformation: {
        alignItems: 'center',
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        flexDirection: 'row',
        paddingHorizontal: normalize(16),
        paddingVertical: normalize(8),
        borderRadius: 5,
        ...Styles.cardShadowStyle,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.COLOR_NEUTRAL_5,
        width: normalize(56),
        height: normalize(56),
    },
    timeIcon: { width: normalize(16), height: normalize(16), tintColor: Colors.COLOR_NEUTRAL_3 },
    timeText: {
        color: Colors.COLOR_NEUTRAL_2,
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
        marginLeft: normalize(8),
    },
    rideInformationImage: {
        tintColor: Colors.COLOR_PRIMARY_1,
        width: normalize(40),
        resizeMode: 'contain',
    },
    driverInformation: {
        position: 'absolute',
        left: normalize(16),
        right: normalize(16),
        bottom: normalize(16),
        paddingVertical: normalize(8),
        paddingHorizontal: normalize(16),
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        borderRadius: 5,
        ...Styles.cardShadowStyle,
    },
    driverName: {
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
    },
    drivePhone: {
        color: Colors.COLOR_NEUTRAL_3,
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
    },
    detailBookingContainer: {
        marginTop: normalize(8),
        borderTopWidth: 0.5,
        borderTopColor: Colors.COLOR_NEUTRAL_3,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: normalize(16),
        paddingBottom: normalize(8),
    },
    detailBooking: {
        color: Colors.COLOR_SECONDARY,
        fontSize: Dimens.TEXT_SIZE_BODY,
    },
    driverEstimatePickupTime: {
        marginTop: normalize(8),
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
    },
    rideInformationContainer: {
        position: 'absolute',
        top: normalize(16),
        left: normalize(16),
        right: normalize(16),
    },
    selectedRide: {
        borderWidth: 0.5,
        borderColor: Colors.COLOR_PRIMARY_1,
    },
});

export default styles;
