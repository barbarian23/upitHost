import { StyleSheet } from 'react-native';
import { Colors, Constants, Dimens } from '../../../commons';
import { normalize } from '../../../commons/utils';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    label: {
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: Dimens.TEXT_SIZE_BODY,
    },
    inputContainer: {
        marginTop: normalize(4),
        borderRadius: normalize(5),
        borderWidth: 0.5,
        paddingVertical: normalize(12),
        flexDirection: 'row',
    },
    input: {
        paddingVertical: 0,
        paddingStart: normalize(16),
        fontSize: Dimens.TEXT_SIZE_BODY,
        fontFamily: Constants.DEFAULT_FONT,
        flex: 1,
        color: Colors.COLOR_NEUTRAL_1,
    },
    inputFocus: {
        borderColor: Colors.COLOR_PRIMARY_1,
    },
    inputBlur: {
        borderColor: Colors.COLOR_NEUTRAL_3,
    },
    passwordVisibleButton: {
        width: normalize(40),
        alignItems: 'center',
        justifyContent: 'center',
    },
    passwordVisibleImage: {
        tintColor: Colors.COLOR_NEUTRAL_3,
        resizeMode: 'contain',
        width: normalize(16),
        height: normalize(16),
    },
    error: {
        marginStart: normalize(16),
        color: Colors.COLOR_SEMATIC,
        marginTop: normalize(8),
        fontSize: Dimens.TEXT_SIZE_BODY,
    },
});

export default styles;
