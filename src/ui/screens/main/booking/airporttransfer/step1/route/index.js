import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import PickerHeader from '../../../../../../components/header/authHeader/PickerHeader';
import Strings from '../../../../../../../utils/LocalizationConfig';

import { ROUTE_FROM_AIRPORT, ROUTE_TO_AIRPORT } from '../../../../../../../commons/const';
import AppText from '../../../../../../components/text/AppTextView';
import { normalize } from '../../../../../../../commons/utils';
import { Colors, Utils } from '../../../../../../../commons';

export default function RoutePicker(props) {
    const { navigation } = props;
    const routes = [ROUTE_FROM_AIRPORT, ROUTE_TO_AIRPORT];
    const selectedRoute = Utils.getParamFromNavigation(navigation, 'route');
    const callback = Utils.getParamFromNavigation(navigation, 'callback');

    const title = (r) => {
        if (r === ROUTE_FROM_AIRPORT) {
            return Strings('label.route_from_airport');
        }
        return Strings('label.route_to_airport');
    };

    return (
        <View style={{ backgroundColor: Colors.COLOR_NEUTRAL_7 }}>
            <PickerHeader
                navigation={navigation}
                title={Strings('header.select_route')}
            />
            <View style={{ padding: normalize(16) }}>
                {
                    routes.map((r) => (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.goBack();
                                callback(r);
                            }}
                            style={{
                                backgroundColor: Colors.COLOR_NEUTRAL_6,
                                borderRadius: normalize(5),
                                marginTop: normalize(12),
                                padding: normalize(16),
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderColor: (r === selectedRoute) ? Colors.COLOR_PRIMARY_1 : Colors.COLOR_NEUTRAL_7,
                                borderWidth: 0.5,
                            }}
                        >
                            <AppText>{title(r)}</AppText>
                        </TouchableOpacity>
                    ))
                }
            </View>
        </View>
    );
}
