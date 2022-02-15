import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors, Constants, Dimens, Utils } from '../../../../../../commons';
import AppDialog from '../../../../../components/dialog/AppDialog';
import AppText from '../../../../../components/text/AppTextView';
import Strings from '../../../../../../utils/LocalizationConfig';
import AppButton from '../../../../../components/button/AppButton';
import { normalize } from '../../../../../../commons/utils';
import AppImage from '../../../../../components/image/AppImage';

export default function PickUpTimeErrorDialog({ onClose, message }) {
    const messageComponents = (message && message.includes('<phone>')) ? message.split('<phone>') : null;
    const preMessage = messageComponents ? messageComponents[0] : Strings('message.error_time_message_1');
    const postMessage = messageComponents ? messageComponents[2] : Strings('message.error_time_message_2');
    const phoneNumber = messageComponents ? messageComponents[1] : Constants.HOTLINE_PHONE;

    return (
        <AppDialog
            onClose={onClose}
            visible
            backgroundColor={Colors.COLOR_GREY_TRANSPARENT}
            onBackdropPress={onClose}
        >
            <View style={styles.successViewContainer}>
                <AppImage
                    style={styles.successImage}
                    source="ic_error_time"
                />
                <AppText bold style={styles.successTitle}>{Strings('label.error_time')}</AppText>
                <AppText style={styles.message}>
                    <AppText>{preMessage}</AppText>
                    <AppText style={{ color: Colors.COLOR_SEMATIC_1 }} bold>{phoneNumber}</AppText>
                    <AppText>{postMessage}</AppText>
                </AppText>
                <View style={{ flexDirection: 'row', marginTop: normalize(24), alignItems: 'center' }}>
                    <TouchableOpacity
                        style={styles.cancelButtonContainer}
                        onPress={onClose}
                    >
                        <AppText style={styles.successGoToStatus}>{Strings('label.cancel')}</AppText>
                    </TouchableOpacity>
                    <AppButton
                        onPress={() => {
                            Utils.makePhoneCall(phoneNumber);
                        }}
                        containerStyle={styles.successConfirmButton}
                        text={Strings('label.call_now')}
                    />
                </View>
            </View>
        </AppDialog>
    );
}

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
        width: normalize(189),
        height: normalize(173),
        resizeMode: 'contain',
    },
    successTitle: {
        marginTop: normalize(24),
        fontSize: normalize(Dimens.TEXT_SIZE_HEADING),
        color: Colors.COLOR_SEMATIC_4,
    },
    successMessage: {
        marginTop: normalize(8),
        textAlign: 'center',
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
        color: Colors.COLOR_NEUTRAL_2,
    },
    successConfirmButton: {
        flex: 1,
    },
    successGoToStatus: {
        color: Colors.COLOR_PRIMARY_1,
        fontSize: normalize(Dimens.TEXT_SIZE_BUTTON),
    },
    cancelButtonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    message: {
        textAlign: 'center',
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
        marginTop: normalize(8),
    },
});
