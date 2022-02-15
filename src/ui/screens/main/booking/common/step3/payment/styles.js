import { StyleSheet } from 'react-native';
import { Colors, Dimens } from '../../../../../../../commons';
import { normalize } from '../../../../../../../commons/utils';

const styles = StyleSheet.create({
    itemContainer: (selected) => ({
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        borderRadius: normalize(5),
        marginTop: normalize(12),
        padding: normalize(16),
        alignItems: 'center',
        borderColor: (selected) ? Colors.COLOR_PRIMARY_1 : Colors.COLOR_NEUTRAL_7,
        borderWidth: 0.5,
        flexDirection: 'row',
    }),
    itemIcon: (selected) => ({
        width: normalize(32),
        height: normalize(32),
        tintColor: selected ? Colors.COLOR_PRIMARY_1 : Colors.COLOR_NEUTRAL_3,
        resizeMode: 'contain',
    }),
    itemText: (selected) => ({
        marginLeft: normalize(16),
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
        color: selected ? Colors.COLOR_NEUTRAL_1 : Colors.COLOR_NEUTRAL_3,
    }),
});

export default styles;
