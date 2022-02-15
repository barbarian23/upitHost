import { StyleSheet } from 'react-native';
import { normalize } from '../../../../commons/utils';
import { Colors, Dimens } from '../../../../commons';

const styles = StyleSheet.create({
    header: {
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(16),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.COLOR_WHITE,
    },
    backButton: {
        width: normalize(24),
        height: normalize(24),
        resizeMode: 'contain',
        tintColor: Colors.COLOR_NEUTRAL_1,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: Dimens.TEXT_SIZE_BODY,
    },
    step: {
        width: normalize(70),
        textAlign: 'right',
        color: Colors.COLOR_NEUTRAL_2,
        fontSize: Dimens.TEXT_SIZE_SUB_BODY,
    },
});

export default styles;
