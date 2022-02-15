import { FlatList, Image, Linking, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import AppContainer from '../../../../components/container';
import AirportBookingHeader from '../../../../components/header/authHeader/AirportBookingHeader';
import Strings from '../../../../../utils/LocalizationConfig';
import { normalize } from '../../../../../commons/utils';
import { Colors, Dimens } from '../../../../../commons';
import AppText from '../../../../components/text/AppTextView';

export default function PlaceList({ navigation }) {
    const addresses = useSelector((state) => state.accountReducer.houseList.data);

    function openMap(geoPoint) {
        const location = `${geoPoint.lat},${geoPoint.lng}`;
        if (Platform.OS === 'ios') {
            Linking.openURL(`http://maps.apple.com/maps?daddr=${location}`);
        } else {
            Linking.openURL(`geo:${location}?q=${location}&z=21`);
        }
    }

    const addressItem = (item) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    openMap(item.geopoint);
                }}
                style={styles.itemContainer}
            >
                <View style={{ flex: 1, marginRight: normalize(16) }}>
                    <AppText style={styles.itemTitle} bold>
                        {item.name}
                    </AppText>
                    <AppText style={styles.itemDescription}>
                        {item.address}
                    </AppText>
                </View>
                <Image
                    source={require('../../../../../assets/icons/ic_map_pin.png')}
                    style={{ width: normalize(40), height: normalize(40), resizeMode: 'contain' }}
                />
            </TouchableOpacity>
        );
    };

    return (
        <AppContainer
            header={(
                <AirportBookingHeader
                    navigation={navigation}
                    title={Strings('header.my_places')}
                />
            )}
        >
            <FlatList
                keyExtractor={(item) => item.id}
                style={{ flex: 1 }}
                data={addresses}
                renderItem={({ item }) => addressItem(item)}
            />
        </AppContainer>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        paddingVertical: normalize(16),
        borderBottomColor: Colors.COLOR_NEUTRAL_3,
        borderBottomWidth: 1,
    },
    itemTitle: {
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
    },
    itemDescription: { color: Colors.COLOR_NEUTRAL_3, fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY) },
});
