import { StyleSheet } from 'react-native';
import { normalize } from '../../../../../../commons/utils';
import { Colors, Dimens, Styles } from '../../../../../../commons';

const styles = StyleSheet.create({
    moveToNextStepView: {
        backgroundColor: Colors.COLOR_WHITE,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: normalize(16),
        elevation: normalize(6),
    },
    moveToNextStepWarningMessage: {
        width: '100%',
        textAlign: 'center',
        marginBottom: normalize(16),
    },
    downArrow: {
        marginLeft: normalize(8),
        width: normalize(12),
        height: normalize(12),
        resizeMode: 'contain',
    },
    routeTypeSelectionContainer: {
        flexDirection: 'row',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(16),
        alignItems: 'center',
        borderRadius: normalize(5),
        borderWidth: 0.5,
        borderColor: Colors.COLOR_NEUTRAL_4,
        backgroundColor: Colors.COLOR_NEUTRAL_6,
    },
    routeType: {
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
        color: Colors.COLOR_NEUTRAL_2,
    },
    timeAndDestinationContainer: {
        backgroundColor: Colors.COLOR_WHITE,
        marginTop: normalize(16),
        padding: normalize(16),
        borderRadius: normalize(5),
        ...Styles.cardShadowStyle,
    },
    destinationContainerFromAirport: {
        flexDirection: 'column',
    },
    destinationContainerToAirport: {
        flexDirection: 'column-reverse',
    },
    vehicleTypeSelectContainer: {
        borderWidth: 1,
        borderColor: Colors.COLOR_NEUTRAL_3,
        flexDirection: 'row',
        paddingVertical: normalize(16),
        paddingHorizontal: normalize(12),
        backgroundColor: Colors.COLOR_WHITE,
        marginTop: normalize(4),
        borderRadius: normalize(4),
        alignItems: 'center',
    },
    vehicleTypeImage: {
        width: normalize(48),
        height: normalize(48),
        resizeMode: 'contain',
    },
    vehicleTypeSelectTitle: {
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
    },
    vehicleTypeSelectDescription: {
        color: Colors.COLOR_SECONDARY,
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
        marginTop: normalize(4),
    },
});

export default styles;
