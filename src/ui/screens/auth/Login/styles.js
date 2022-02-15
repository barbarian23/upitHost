import { StyleSheet } from 'react-native';
import { Colors, Dimens } from '../../../../commons';
import { normalize } from '../../../../commons/utils';

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.COLOR_NEUTRAL_7,
        flexDirection: 'column',
        flex: 1,
    },
    header: {
        paddingVertical: normalize(12),
        paddingStart: normalize(16),
    },
    backButton: {
        width: normalize(24),
        height: normalize(24),
        resizeMode: 'contain',
    },
    content: {
        flexDirection: 'column',
        paddingHorizontal: normalize(24),
    },
    title: {
        marginTop: normalize(60),
    },
    titleText: {
        fontSize: Dimens.TEXT_SIZE_HEADING,
        color: Colors.COLOR_NEUTRAL_1,
    },
    descriptionText: {
        fontSize: Dimens.TEXT_SIZE_SUB_HEADING,
        color: Colors.COLOR_NEUTRAL_3,
        marginTop: normalize(8),
    },
    form: {
        marginTop: normalize(36),
    },
    forgetPassword: {
        fontSize: Dimens.TEXT_SIZE_BUTTON,
        color: Colors.COLOR_NEUTRAL_1,
        alignSelf: 'center',
    },
});

export default styles;
