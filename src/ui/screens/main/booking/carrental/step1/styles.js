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
    formContainer: {
        ...Styles.cardShadowStyle,
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        padding: normalize(16),
        marginTop: normalize(22),
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
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
    },
    vehicleTypeSelectDescription: {
        color: Colors.COLOR_SECONDARY,
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
        marginTop: normalize(4),
    },
    priceInformationButtonContainer: {
        position: 'absolute',
        right: normalize(20),
        top: 2,
        width: normalize(40),
        height: normalize(40),
        backgroundColor: Colors.COLOR_NEUTRAL_7,
        borderRadius: normalize(20),
        alignItems: 'center',
        justifyContent: 'center',
    },
    priceInformationButtonInnerContainer: {
        width: normalize(36),
        height: normalize(36),
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        borderRadius: normalize(18),
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default styles;
