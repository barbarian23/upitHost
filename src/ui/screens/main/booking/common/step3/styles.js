import { StyleSheet } from 'react-native';
import { Colors, Constants, Dimens, Styles } from '../../../../../../commons';
import { normalize } from '../../../../../../commons/utils';

const styles = StyleSheet.create({
    total: {
        flex: 1,
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
    },
    totalValue: {
        color: Colors.COLOR_PRIMARY_1,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
    },
    bookConfirmContainer: { padding: normalize(16), backgroundColor: Colors.COLOR_NEUTRAL_6 },
    sectionLabelContainer: { flexDirection: 'row', alignItems: 'center' },
    sectionLabel: { flex: 1, fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY) },
    edit: {
        color: Colors.COLOR_SECONDARY,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
    },
    container: { flex: 1, backgroundColor: Colors.COLOR_NEUTRAL_7, padding: normalize(16) },
    sectionContent: {
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        marginTop: normalize(8),
        padding: normalize(16),
        ...Styles.cardShadowStyle,
    },
    sectionTitle: {
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
    },
    sectionDescription: {
        color: Colors.COLOR_NEUTRAL_2,
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
        marginTop: normalize(8),
    },
    passengerInformationSection: {
        marginTop: normalize(24),
    },
    paymentMethodSection: {
        marginTop: normalize(24),
    },
    paymentMethodImage: {
        width: normalize(20),
        height: normalize(20),
        tintColor: Colors.COLOR_PRIMARY_1,
        resizeMode: 'contain',
    },
    paymentMethodContent: {
        marginTop: normalize(8),
        flexDirection: 'row',
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        padding: normalize(16),
        alignItems: 'center',
        ...Styles.cardShadowStyle,
    },
    priceSection: {
        marginTop: normalize(24),
        marginBottom: normalize(48),
    },
    systemPrice: {
        flexDirection: 'row',
        borderBottomColor: Colors.COLOR_NEUTRAL_3,
        borderBottomWidth: 0.5,
        paddingBottom: normalize(16),
        alignItems: 'center',
    },
    commonPriceLabel: {
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
        flex: 1,
    },
    systemPriceValue: {
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
    },
    commission: {
        paddingTop: normalize(16),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: Colors.COLOR_NEUTRAL_3,
        borderBottomWidth: 0.5,
        paddingBottom: normalize(16),
    },
    totalPrice: {
        paddingTop: normalize(16),
        flexDirection: 'row',
        alignItems: 'center',
        borderTopColor: Colors.COLOR_NEUTRAL_1,
        borderTopWidth: 1,
        paddingBottom: normalize(16),
    },
    totalPriceInput: (valid) => ({
        textAlign: 'right',
        fontFamily: Constants.DEFAULT_FONT_BOLD,
        color: (valid ? Colors.COLOR_NEUTRAL_1 : Colors.COLOR_SEMATIC_4),
    }),
});

export default styles;
