import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import styles from './styles';
import AppButton from '../../components/button/AppButton';
import Strings from '../../../utils/LocalizationConfig';
import AppText from '../../components/text/AppTextView';
import { Constants, Storage } from '../../../commons';

export default function WelcomeScreen(props) {
    const { navigation } = props;

    async function navigateToSignInRoute() {
        const accountList = await Storage.getDataJson(Constants.KEY_PREVIOUS_USER_LIST);
        navigation.navigate(accountList && accountList.length > 0 ? 'AccountList' : 'SignIn');
    }

    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={require('../../../assets/icons/ic_splash.png')}
            />
            <View style={styles.content}>
                <View style={styles.welcomeContainer}>
                    <AppText style={styles.welcomeTitle}>{Strings('label.welcome_to_upde')}</AppText>
                    <AppText style={styles.welcomeDescription}>{Strings('label.welcome_to_upde_description')}</AppText>
                </View>
                <View style={styles.buttonGroupContainer}>
                    <AppButton
                        onPress={() => navigateToSignInRoute()}
                        text={Strings('label.sign_in')}
                    />
                    {/*<View style={styles.skipContainer}>*/}
                    {/*    <TouchableOpacity>*/}
                    {/*        <AppText style={styles.skip}>Skip</AppText>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*</View>*/}
                </View>
            </View>

        </View>
    );
}
