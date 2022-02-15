import React from 'react';
import { Image, Linking, StyleSheet, View } from 'react-native';
import { normalize } from '../../../../../commons/utils';
import { Colors, Dimens } from '../../../../../commons';
import AppText from '../../../../components/text/AppTextView';
import Strings from '../../../../../utils/LocalizationConfig';
import AppButton from '../../../../components/button/AppButton';

export default function PermissionRequired(props) {

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../../../assets/icons/ic_settings.png')}
                style={styles.image}
            />
            <AppText
                bold
                style={styles.title}
            >
                {Strings('label.permission_needed')}
            </AppText>
            <AppText
                style={styles.description}
            >
                {Strings('label.notification_permission_description')}
            </AppText>
            <AppButton
                containerStyle={{marginTop: normalize(32)}}
                text={Strings('label.open_settings')}
                onPress={() => {
                    Linking.openURL('app-settings://notification/com.upit.apphost').then(
                        (result) => {
                            // recheck subscreens
                            console.log('subscreens::result', result);
                        },
                    );
                }}

            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: normalize(16) },
    image: {
        width: normalize(100),
        height: normalize(100),
        tintColor: Colors.COLOR_PRIMARY_1,
        resizeMode: 'contain',
    },
    title: {
        marginTop: normalize(32),
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
        color: Colors.COLOR_NEUTRAL_1,
        textAlign: 'center',
    },
    description: {
        marginTop: normalize(16),
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
        color: Colors.COLOR_NEUTRAL_3,
        textAlign: 'center',
    },
});
