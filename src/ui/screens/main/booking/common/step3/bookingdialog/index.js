import Spinner from 'react-native-spinkit';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import AppDialog from '../../../../../../components/dialog/AppDialog';
import { Colors, Constants, Utils } from '../../../../../../../commons';
import styles from './styles';
import AppText from '../../../../../../components/text/AppTextView';
import Strings from '../../../../../../../utils/LocalizationConfig';
import AppButton from '../../../../../../components/button/AppButton';
import { normalize } from '../../../../../../../commons/utils';

export const BookingDialogState = {
    CONFIRM: 1,
    LOADING: 2,
    SUCCESS: 3,
    FAILED: 4,
};

export const PROGRESS = {
    BOOKING: 'booking',
    UPDATE: 'update',
};

export default function BookingDialog(props) {
    const { onClose, visible, onConfirm, onSuccessGoToStatus, onSuccessGoToHome, progress = PROGRESS.BOOKING } = props;
    const { error } = props;

    const confirmDialogTitle = () => {
        switch (progress) {
            case PROGRESS.BOOKING:
                return Strings('label.confirm_dialog_title');
            default:
                return Strings('label.update_dialog_title');
        }
    };

    const bookingConfirm = () => (
        <View style={styles.container}>
            <AppText bold style={styles.title}>{confirmDialogTitle()}</AppText>
            <AppButton
                onPress={onConfirm}
                containerStyle={styles.confirmButton}
                text={Strings('label.yes')}
            />
            <TouchableOpacity
                style={styles.rejectButton}
                onPress={onClose}
            >
                <AppText style={styles.no}>
                    {Strings('label.no')}
                </AppText>
            </TouchableOpacity>
        </View>
    );

    const bookingFailedTitle = () => {
        switch (progress) {
            case PROGRESS.BOOKING:
                return Strings('label.booking_failed');
            default:
                return Strings('label.changed_time_failed');
        }
    };

    const bookingFailedMessage = () => {
        const { message } = error;
        if (message) {
            if (message.includes('<phone>')) {
                return message.split('<phone>').join('');
            }
            return message;
        }
        switch (progress) {
            case PROGRESS.BOOKING:
                return Strings('label.booking_failed_message');
            default:
                return Strings('label.changed_time_failed_message');
        }
    };

    const bookingFailedButtonView = () => {
        const { code } = error;
        if (code && code === 'TIME_LEAVE_ERROR_PLEASE_CALL_SUPPORTER') {
            return [
                (
                    <AppButton
                        onPress={() => {
                            Utils.makePhoneCall(Constants.HOTLINE_PHONE);
                        }}
                        containerStyle={styles.errorConfirmButton}
                        text={Strings('label.call_support')}
                    />),
                (
                    <TouchableOpacity
                        style={{
                            paddingVertical: normalize(12),
                            marginTop: normalize(16),
                        }}
                        onPress={onClose}
                    >
                        <AppText style={styles.successGoToStatus}>{Strings('label.change_booking_info')}</AppText>
                    </TouchableOpacity>),
            ];
        }
        return [
            (
                <AppButton
                    onPress={onClose}
                    containerStyle={styles.errorConfirmButton}
                    text={Strings('label.ok')}
                />
            ),
        ];
    };

    const bookingFailedView = () => (
        <View style={styles.successViewContainer}>
            <Image
                style={styles.failedImage}
                source={require('../../../../../../../assets/icons/ic_booking_failed.png')}
            />
            <AppText bold style={styles.failedTitle}>{bookingFailedTitle()}</AppText>
            <AppText style={styles.failedMessage}>{bookingFailedMessage()}</AppText>
            {bookingFailedButtonView()}
        </View>
    );

    const successTitle = () => {
        switch (progress) {
            case PROGRESS.BOOKING:
                return Strings('label.booking_success');
            default:
                return Strings('label.changed_time_success');
        }
    };

    const successSecondaryButton = () => {
        switch (progress) {
            case PROGRESS.BOOKING:
                return Strings('label.go_to_list_booking');
            default:
                return Strings('label.go_to_detail_booking');
        }
    };

    const bookingSuccessView = () => (
        <View style={styles.successViewContainer}>
            <Image
                style={styles.successImage}
                source={require('../../../../../../../assets/icons/ic_booking_success.png')}
            />
            <AppText bold style={styles.successTitle}>{successTitle()}</AppText>
            <AppText style={styles.successMessage}>{Strings('label.booking_success_message')}</AppText>
            <AppButton
                onPress={onSuccessGoToHome}
                containerStyle={styles.successConfirmButton}
                text={Strings('label.back_to_homepage')}
            />
            <TouchableOpacity
                style={{
                    paddingVertical: normalize(12),
                    marginTop: normalize(16),
                }}
                onPress={onSuccessGoToStatus}
            >
                <AppText style={styles.successGoToStatus}>{successSecondaryButton()}</AppText>
            </TouchableOpacity>
        </View>
    );

    const loadingView = () => (
        <Spinner
            size={30}
            type="Wave"
            color={Colors.COLOR_PRIMARY_1}
            isVisible
            style={{ alignSelf: 'center' }}
        />
    );

    const onBackdropPress = () => {
        switch (visible) {
            case null:
            case BookingDialogState.CONFIRM:
            case BookingDialogState.FAILED:
                return onClose;
            case BookingDialogState.LOADING:
                return null;
            default:
            case BookingDialogState.SUCCESS:
                return onSuccessGoToHome;
        }
    };
    const dialogView = () => {
        switch (visible) {
            case null:
                return <View />;
            case BookingDialogState.CONFIRM:
                return bookingConfirm();
            case BookingDialogState.LOADING:
                return loadingView();
            case BookingDialogState.SUCCESS:
                return bookingSuccessView();
            case BookingDialogState.FAILED:
            default:
                return bookingFailedView();
        }
    };

    return (
        <AppDialog
            onClose={onClose}
            visible={!!(visible)}
            backgroundColor={Colors.COLOR_GREY_TRANSPARENT}
            onBackdropPress={onBackdropPress()}
        >
            {dialogView()}
        </AppDialog>
    );
}
