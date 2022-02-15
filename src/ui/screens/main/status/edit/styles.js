import { StyleSheet } from 'react-native';
import { Colors, Dimens, Styles } from '../../../../../commons';
import { normalize } from '../../../../../commons/utils';

const styles = StyleSheet.create({
    note: { fontSize: normalize(Dimens.TEXT_SIZE_BODY) },
    noteLabel: { color: Colors.COLOR_SECONDARY },
    noteContent: { color: Colors.COLOR_NEUTRAL_1 },
    pricingTitle: {
        flex: 1,
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
    },
    changeCollapsibleStatusButton: {
        color: Colors.COLOR_SECONDARY,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
    },
    priceChangeSummary: {
        marginTop: normalize(16),
        padding: normalize(16),
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        ...Styles.cardShadowStyle,
    },
    priceItemContainer: {
        paddingVertical: normalize(16),
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.COLOR_NEUTRAL_3,
    },
    priceItemContainerTotal: {
        borderBottomWidth: 0,
        borderTopWidth: 1,
        borderTopColor: Colors.COLOR_NEUTRAL_1,
    },
    priceLabel: {
        flex: 1,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
        color: Colors.COLOR_NEUTRAL_1,
    },
    priceValue: {
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
        color: Colors.COLOR_NEUTRAL_1,
    },
});

export default styles;
