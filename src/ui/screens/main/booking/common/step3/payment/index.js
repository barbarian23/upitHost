import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import PickerHeader from '../../../../../../components/header/authHeader/PickerHeader';
import Strings from '../../../../../../../utils/LocalizationConfig';

import { debtPayment, payOnline, payWithCash } from '../../../../../../../commons/const';
import AppText from '../../../../../../components/text/AppTextView';
import { normalize } from '../../../../../../../commons/utils';
import { Colors, Utils } from '../../../../../../../commons';
import styles from './styles';

export default function PaymentPicker(props) {
    const { navigation } = props;
    const methods = [payWithCash, debtPayment];
    const selectedRoute = Utils.getParamFromNavigation(navigation, 'payment');
    const callback = Utils.getParamFromNavigation(navigation, 'callback');

    const title = (r) => r[`name_${Strings('language')}`];

    return (
        <View style={{ backgroundColor: Colors.COLOR_NEUTRAL_7 }}>
            <PickerHeader
                navigation={navigation}
                title={Strings('header.select_payment_method')}
            />
            <View style={{ padding: normalize(16) }}>
                {
                    methods.map((r) => (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.goBack();
                                callback(r);
                            }}
                            style={styles.itemContainer(r === selectedRoute)}
                        >
                            <Image
                                style={styles.itemIcon(r === selectedRoute)}
                                source={r.icon}
                            />
                            <AppText style={styles.itemText(r === selectedRoute)}>{title(r)}</AppText>
                        </TouchableOpacity>
                    ))
                }
            </View>
        </View>
    );
}
