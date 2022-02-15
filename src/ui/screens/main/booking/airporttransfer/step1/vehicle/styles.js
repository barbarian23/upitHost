import { StyleSheet } from 'react-native';
import { Colors, Dimens, Styles } from '../../../../../../../commons';
import { normalize } from '../../../../../../../commons/utils';

const bg = (available, select) => {
    if (available) {
        if (select) {
            return Colors.COLOR_NEUTRAL_5;
        }
        return Colors.COLOR_NEUTRAL_6;
    }
    return Colors.COLOR_NEUTRAL_4;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.COLOR_NEUTRAL_7,
    },
    itemContainer: (select, available) => ({
        borderRadius: normalize(4),
        marginBottom: normalize(16),
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(16),
        backgroundColor: bg(available, select),
        ...Styles.cardShadowStyle,
        borderWidth: select ? 2 : 0.5,
        borderColor: (select) ? Colors.COLOR_PRIMARY_1 : Colors.COLOR_NEUTRAL_4,
    }),
    itemHeader: {
        paddingBottom: normalize(8),
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: normalize(48),
        height: normalize(48),
        resizeMode: 'contain',
    },
    headerTextContainer: {
        marginLeft: normalize(12),
    },
    name: {
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
    },
    estimatePrice: {
        color: Colors.COLOR_SEMATIC_3,
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
        marginTop: normalize(4),
    },
    previousPrice: {
        marginTop: normalize(4),
        textDecorationLine: 'line-through',
        color: Colors.COLOR_NEUTRAL_3,
        fontSize: Dimens.TEXT_SIZE_SUB_BODY,
    },
    note: {
        color: Colors.COLOR_NEUTRAL_2,
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
    },
    itemFooter: {
        paddingTop: normalize(8),
        borderTopColor: Colors.COLOR_NEUTRAL_3,
        borderTopWidth: 1,
    },
});

export default styles;
