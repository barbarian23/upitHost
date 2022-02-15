import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Colors, Dimens } from '../../../../../commons';
import AppDialog from '../../../../components/dialog/AppDialog';
import { normalize } from '../../../../../commons/utils';
import AppText from '../../../../components/text/AppTextView';
import Strings from '../../../../../utils/LocalizationConfig';
import AppButton from '../../../../components/button/AppButton';

export default function UpdateTimeInstruction(props) {
    const { onClose, visible, onPress } = props;

    return (
        <AppDialog
            onClose={onClose}
            visible={!!(visible)}
            backgroundColor={Colors.COLOR_GREY_TRANSPARENT}
            onBackdropPress={onClose}
        >
            <View style={styles.container}>
                <AppText
                    bold
                    style={{
                        color: Colors.COLOR_NEUTRAL_1,
                        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
                        textAlign: 'center',
                    }}
                >
                    {Strings('label.change_booking_info')}
                </AppText>
                <View style={styles.descriptionBlock}>
                    <AppText style={{ fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY) }}>
                        {Strings('label.change_booking_info_description_before_1_hours')}
                    </AppText>
                    <AppText style={{ marginTop: normalize(8), fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY) }}>
                        {Strings('label.change_booking_info_description_night_ride')}
                    </AppText>
                </View>
                <AppText
                    bold
                    style={{ marginTop: normalize(8), fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY) }}
                >
                    {Strings('label.change_booking_info_description_contact')}
                </AppText>
                <AppButton
                    containerStyle={{ marginTop: normalize(32) }}
                    onPress={onPress}
                    text={Strings('label.call')}
                />
                <TouchableOpacity
                    onPress={onClose}
                    style={{ marginTop: normalize(8) }}
                >
                    <AppText
                        bold
                        style={{
                            fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
                            color: Colors.COLOR_PRIMARY_1,
                        }}
                    >
                        {Strings('label.close')}
                    </AppText>
                </TouchableOpacity>
            </View>
        </AppDialog>
    );
}

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
    descriptionBlock: {
        paddingVertical: normalize(16),
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.COLOR_NEUTRAL_3,
    },
});
