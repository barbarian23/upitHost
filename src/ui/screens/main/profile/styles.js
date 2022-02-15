import { StyleSheet } from 'react-native';
import { normalize } from '../../../../commons/utils';
import { Colors, Dimens, Styles } from '../../../../commons';

const styles = StyleSheet.create({
    imageFooter: {
        height: normalize(24),
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'rgba(37, 7, 7, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: normalize(5),
        borderBottomRightRadius: normalize(5),
    },
    profileImage: {
        width: normalize(120),
        height: normalize(120),
        resizeMode: 'cover',
        borderRadius: normalize(5),
    },
    plus: {
        width: normalize(16),
        height: normalize(16),
        tintColor: Colors.COLOR_NEUTRAL_6,
    },
    imageContainer: {
        width: normalize(120),
        height: normalize(120),
        position: 'absolute',
        left: '50%',
        marginLeft: normalize(-60),
        ...Styles.cardShadowStyle,
        elevation: 5,
        zIndex: 2,
    },
    profileInformationContainer: {
        zIndex: 0,
        marginTop: normalize(60),
        padding: normalize(16),
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        ...Styles.cardShadowStyle,
        alignItems: 'center',
        paddingTop: normalize(60),
    },
    email: {
        marginTop: normalize(4),
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_HEADING),
        color: Colors.COLOR_NEUTRAL_2,
    },
    name: {
        marginTop: normalize(16),
        fontSize: normalize(Dimens.TEXT_SIZE_HEADING),
        color: Colors.COLOR_NEUTRAL_1,
    },
    balanceContainer: {
        ...Styles.cardShadowStyle,
        padding: normalize(16),
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        marginTop: normalize(16),
        flexDirection: 'row',
    },
    balanceImageContainer: { backgroundColor: '#217BE5', padding: normalize(16), borderRadius: normalize(5) },
    balanceTitle: {
        fontSize: Dimens.TEXT_SIZE_SUB_BODY,
        color: Colors.COLOR_NEUTRAL_1,
    },
    balanceValue: {
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
        color: Colors.COLOR_SECONDARY_2,
    },
    balanceDescription: {
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
        color: Colors.COLOR_NEUTRAL_2,
    },
    bottomSelection: {
        marginTop: normalize(16),
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        ...Styles.cardShadowStyle,
        padding: normalize(16),
    },
    transactionStatus: {
        paddingVertical: normalize(8),
        paddingBottom: normalize(16),
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.COLOR_NEUTRAL_3,
    },
    bottomSelectionTitle: {
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
    },
    bottomSelectionDescription: {
        marginTop: normalize(4),
        color: Colors.COLOR_SEMATIC,
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
    },
    myPlaces: {
        paddingVertical: normalize(24),
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.COLOR_NEUTRAL_3,
    },
    settings: {
        paddingBottom: normalize(16),
        paddingTop: normalize(24),
        alignItems: 'center',
        flexDirection: 'row',
    },
    logoutContainer: {
        marginTop: normalize(16),
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        ...Styles.cardShadowStyle,
        padding: normalize(16),
        flexDirection: 'row',
        alignItems: 'center'
    },
});

export default styles;
