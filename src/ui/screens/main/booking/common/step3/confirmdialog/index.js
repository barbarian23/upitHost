import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppDialog from '../../../../../../components/dialog/AppDialog';
import { normalize } from '../../../../../../../commons/utils';
import { Colors, Dimens } from '../../../../../../../commons';
import AppText from '../../../../../../components/text/AppTextView';
import Strings from '../../../../../../../utils/LocalizationConfig';
import AppButton from '../../../../../../components/button/AppButton';

const styles = StyleSheet.create({
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

export default function ConfirmDialog(props) {
    const { onClose, visible, onConfirm, onCancel } = props;

    return (
        <AppDialog
            disableSwipeDown
            onClose={onClose}
            visible={visible}
        >
            <View style={styles.container}>
                <AppText bold style={styles.title}>{Strings('label.confirm_dialog_title')}</AppText>
                <AppButton
                    onPress={onConfirm}
                    containerStyle={styles.confirmButton}
                    text={Strings('label.yes')}
                />
                <TouchableOpacity
                    onPress={onCancel}
                    style={styles.rejectButton}
                >
                    <AppText style={styles.no}>
                        {Strings('label.no')}
                    </AppText>
                </TouchableOpacity>
            </View>
        </AppDialog>
    );
}
