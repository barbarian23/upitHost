import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import AppText from '../../../../components/text/AppTextView';
import Strings from '../../../../../utils/LocalizationConfig';
import AppButton from '../../../../components/button/AppButton';
import { normalize } from '../../../../../commons/utils';
import { Colors, Dimens } from '../../../../../commons';

export default function RideComplete({ onPress }) {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../../../../assets/icons/ic_checklist.png')}
                style={styles.image}
            />
            <AppText
                bold
                style={styles.title}
            >
                {Strings('label.ride_complete')}
            </AppText>
            <AppText
                style={styles.description}
            >
                {Strings('label.ride_complete_message')}
            </AppText>
            <AppButton
                containerStyle={{ marginTop: normalize(32) }}
                text={Strings('label.track_new_ride')}
                onPress={onPress}
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
