import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import AppDialog from '../../../components/dialog/AppDialog';
import { Colors, Dimens } from '../../../../commons';
import Spinner from 'react-native-spinkit';
import AppText from '../../../components/text/AppTextView';
import Strings from '../../../../utils/LocalizationConfig';
import AppButton from '../../../components/button/AppButton';
import { normalize } from '../../../../commons/utils';

export const LOADING_STATE = 1;
export const SUCCESS_STATE = 2;

export default function ResetPasswordOverlay({ onClose, visible, onSuccessGoToLogin }) {
    const dialogView = () => {
        if (visible) {
            if (visible === LOADING_STATE) {
                return (
                    <Spinner
                        size={30}
                        type="Wave"
                        color={Colors.COLOR_PRIMARY_1}
                        isVisible
                        style={{ alignSelf: 'center' }}
                    />
                );
            }
            return (
                <View style={styles.successViewContainer}>
                    <Image
                        style={styles.successImage}
                        source={require('../../../../assets/icons/ic_success.png')}
                    />
                    <AppText bold style={styles.successTitle}>{Strings('label.send_email_successfully')}</AppText>
                    <AppText style={styles.successMessage}>{Strings('label.reset_password_message')}</AppText>
                    <AppButton
                        onPress={onSuccessGoToLogin}
                        containerStyle={styles.successConfirmButton}
                        text={Strings('label.back_to_login')}
                    />
                </View>
            );
        }
        return (<View />);
    };

    return (
        <AppDialog
            onClose={onClose}
            visible={!!(visible)}
            backgroundColor={Colors.COLOR_GREY_TRANSPARENT}
        >
            {dialogView()}
        </AppDialog>
    );
}

const styles = StyleSheet.create({
    successImage: {
        width: normalize(120),
        height: normalize(120),
        resizeMode: 'contain',
        marginVertical: normalize(48),
    },
    successTitle: {
        marginTop: normalize(8),
        fontSize: normalize(Dimens.TEXT_SIZE_HEADING),
        color: Colors.COLOR_SEMATIC_2,
    },
    successMessage: {
        marginTop: normalize(8),
        textAlign: 'center',
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
        color: Colors.COLOR_NEUTRAL_2,
    },
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
    successConfirmButton: {
        marginTop: normalize(32),
    },
});
