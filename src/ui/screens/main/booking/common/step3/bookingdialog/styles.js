import { StyleSheet } from 'react-native';
import { Colors, Dimens } from '../../../../../../../commons';
import { normalize } from '../../../../../../../commons/utils';

const styles = StyleSheet.create({
    successViewContainer: {
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        borderRadius: normalize(10),
        paddingHorizontal: normalize(16),
        paddingTop: normalize(16),
        paddingBottom: normalize(16),
        width: '80%',
        alignSelf: 'center',
        alignItems: 'center',
    },
    successImage: {
        width: '90%',
        resizeMode: 'contain',
        height: normalize(200),
    },
    failedImage: {
        marginTop: normalize(48),
        width: normalize(120),
        height: normalize(120),
    },
    successTitle: {
        marginTop: normalize(8),
        fontSize: normalize(Dimens.TEXT_SIZE_HEADING),
        color: Colors.COLOR_SEMATIC_2,
    },
    failedTitle: {
        marginTop: normalize(48),
        fontSize: normalize(Dimens.TEXT_SIZE_HEADING),
        color: Colors.COLOR_SEMATIC_4,
    },
    successMessage: {
        marginTop: normalize(8),
        textAlign: 'center',
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
        color: Colors.COLOR_NEUTRAL_2,
    },
    failedMessage: {
        marginTop: normalize(8),
        textAlign: 'center',
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
        color: Colors.COLOR_NEUTRAL_2,
    },
    successConfirmButton: {
        marginTop: normalize(32),
    },
    errorConfirmButton: {
        marginTop: normalize(32),
    },
    successGoToStatus: {
        color: Colors.COLOR_PRIMARY_1,
        fontSize: normalize(Dimens.TEXT_SIZE_BUTTON),
    },
    container: {
        borderRadius: normalize(10),
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        paddingHorizontal: normalize(16),
        paddingVertical: normalize(32),
        width: '90%',
        alignSelf: 'center',
        alignItems: 'center',
    },
    confirmButton: {
        marginTop: normalize(32),
    },
    rejectButton: {
        marginTop: normalize(20),
    },
    title: {
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
        color: Colors.COLOR_NEUTRAL_1,
    },
    no: {
        color: Colors.COLOR_PRIMARY_1,
        fontSize: normalize(Dimens.TEXT_SIZE_BUTTON),
    },
});

export default styles;
