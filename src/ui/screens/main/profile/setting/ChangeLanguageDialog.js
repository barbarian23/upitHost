import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppDialog from '../../../../components/dialog/AppDialog';
import AppText from '../../../../components/text/AppTextView';
import Strings from '../../../../../utils/LocalizationConfig';
import { Colors, Constants, Dimens } from '../../../../../commons';
import { normalize } from '../../../../../commons/utils';

export default function ChangeLanguageDialog({ onClose, visible, languageSelect }) {
    const lang = Strings('language');

    const ENSelection = () => (
        <TouchableOpacity
            onPress={() => languageSelect(Constants.language[0])}
            style={[styles.selectContainer, {
                borderBottomColor: 'rgba(17, 17, 17, 0.5)',
                borderBottomWidth: 0.5,
            }]}
        >
            <AppText
                style={styles.languageLabel(lang === 'en')}
                bold={lang === 'en'}
            >
                {Strings('label.english')}
            </AppText>
        </TouchableOpacity>
    );

    const VISelection = () => (
        <TouchableOpacity
            onPress={() => languageSelect(Constants.language[1])}
            style={styles.selectContainer}
        >
            <AppText
                style={styles.languageLabel(lang === 'vi')}
                bold={lang === 'vi'}
            >
                {Strings('label.vietnamese')}
            </AppText>
        </TouchableOpacity>
    );

    return (
        <AppDialog
            dialogJustifyContent="flex-end"
            onClose={onClose}
            visible={visible}
        >
            <View style={styles.container}>
                {ENSelection()}
                {VISelection()}
            </View>
        </AppDialog>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.COLOR_NEUTRAL_6,
    },
    selectContainer: {
        height: normalize(60),
        alignItems: 'center',
        justifyContent: 'center',
    },
    languageLabel: (selected) => ({
        color: selected ? Colors.COLOR_PRIMARY : Colors.COLOR_NEUTRAL_1,
        fontSize: normalize(Dimens.TEXT_SIZE_BUTTON),
    }),
});
