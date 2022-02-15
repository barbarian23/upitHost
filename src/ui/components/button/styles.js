import { StyleSheet } from 'react-native';
import { Colors, Dimens } from '../../../commons';
import { normalize } from '../../../commons/utils';

const styles = StyleSheet.create({
    containerPrimary: {
        backgroundColor: Colors.COLOR_PRIMARY,
    },
    containerOutline: {
        backgroundColor: Colors.COLOR_TRANSPARENT,
    },
    container: {
        paddingVertical: normalize(12),
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: Colors.COLOR_WHITE,
        fontSize: Dimens.TEXT_SIZE_BUTTON,
    },
    textButtonPrimary: {
        color: Colors.COLOR_NEUTRAL_6,
    },
    textButtonOutline: {
        color: Colors.COLOR_PRIMARY,
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    disabled: {
        backgroundColor: Colors.COLOR_NEUTRAL_4,
    },
});

export default styles;
