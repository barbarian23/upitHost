import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import AppContainer from '../../../../components/container';
import Strings from '../../../../../utils/LocalizationConfig';
import AirportBookingHeader from '../../../../components/header/authHeader/AirportBookingHeader';
import { Colors, Constants, Dimens, Storage, Styles } from '../../../../../commons';
import { normalize } from '../../../../../commons/utils';
import AppText from '../../../../components/text/AppTextView';
import ChangeLanguageDialog from './ChangeLanguageDialog';

export default function Setting({ navigation }) {
    const [languageDialogVisible, setLanguageDialogVisible] = useState(false);
    return (
        <AppContainer
            header={(
                <AirportBookingHeader
                    navigation={navigation}
                    title={Strings('header.setting')}
                />
            )}
        >
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ChangePassword')}
                    style={styles.buttonContainer}
                >
                    <AppText style={styles.buttonTitle}>{Strings('label.change_password')}</AppText>
                    <Image
                        source={require('../../../../../assets/icons/ic_right_arrow.png')}
                        style={styles.rightArrowIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setLanguageDialogVisible(true);
                    }}
                    style={styles.buttonContainer}
                >
                    <AppText style={styles.buttonTitle}>{Strings('label.change_language')}</AppText>
                    <Image
                        source={require('../../../../../assets/icons/ic_right_arrow.png')}
                        style={styles.rightArrowIcon}
                    />
                </TouchableOpacity>
                <View style={styles.buttonContainerNoUnderline}>
                    <AppText style={styles.buttonTitle}>{Strings('label.version')}</AppText>
                    <AppText style={styles.version}>{Constants.VERSION()}</AppText>
                </View>
            </View>
            <ChangeLanguageDialog
                visible={languageDialogVisible}
                onClose={() => {
                    setLanguageDialogVisible(false);
                }}
                languageSelect={async (lang) => {
                    await Storage.setDataJson(Constants.KEY_LANGUAGE, lang);
                    setTimeout(() => {
                        navigation.navigate('Splash');
                    }, 1000);
                }}
            />
        </AppContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        ...Styles.cardShadowStyle,
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        paddingHorizontal: normalize(16),
    },
    buttonContainer: {
        paddingVertical: normalize(24),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.COLOR_NEUTRAL_3,
    },
    buttonContainerNoUnderline: {
        paddingVertical: normalize(24),
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightArrowIcon: {
        width: normalize(24),
        height: normalize(24),
    },
    buttonTitle: {
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
        flex: 1,
    },
    version: {
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
    },
});
