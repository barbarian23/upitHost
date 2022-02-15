import React from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import PickerHeader from '../../../../../../components/header/authHeader/PickerHeader';
import Strings from '../../../../../../../utils/LocalizationConfig';
import { Utils } from '../../../../../../../commons';
import AppText from '../../../../../../components/text/AppTextView';
import renderIf, { normalize } from '../../../../../../../commons/utils';
import { ROUTE_FROM_AIRPORT } from '../../../../../../../commons/const';

export const getPriceFromRoute = (route, supplierExtraPrice = 0) => {
    return {
        total: route.systemPrice - route.discountPrice + supplierExtraPrice,
        system: route.systemPrice + supplierExtraPrice,
        discount: route.discountPrice,
    };
};

export const estimatePrice = (p, route, supplierExtraPrice) => {
    if (!p) {
        return { system: -1, discount: -1, total: -1 };
    }

    const priceByRouteType = route === ROUTE_FROM_AIRPORT ? p.fromAirport : p.toAirport;
    return getPriceFromRoute(priceByRouteType, supplierExtraPrice);
};

export const getPriceFromSymbol = (price, symbol) => {
    if (price) {
        return price[symbol];
    }
    return null;
};

export default function VehiclePicker(props) {
    // const extraPrice = useSelector((state) => state.bookingReducer.extraPrice.data);
    // const price = useSelector((state) => state.bookingReducer.price.data);

    const { navigation } = props;
    const { vehicles, selected, callback, route, service, price, extraPrice } = Utils.getAllParamFromNavigation(navigation);
    const bookingExtraPrice = extraPrice ? extraPrice.extra_price_supplier : 0;

    const keyGenerator = () => (
        Math.random().toString(36).substr(2, 10)
    );

    const vehicle = (item) => {
        const { symbol, seat, available, name } = item;
        const note = Utils.vehicleNote(symbol);
        const { system, discount, total } = (service === 'CR')
            ? getPriceFromRoute(getPriceFromSymbol(price, symbol), 0)
            : estimatePrice(getPriceFromSymbol(price, symbol), route, bookingExtraPrice);

        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.goBack();
                    callback(item);
                }}
                style={styles.itemContainer(selected.name === name, available)}
                disabled={!available}
            >
                <View style={styles.itemHeader}>
                    <Image
                        style={styles.image}
                        source={Utils.vehicleIcon(symbol)}
                    />
                    <View style={styles.headerTextContainer}>
                        <AppText
                            style={styles.name}
                            numberOfLines={1}
                        >
                            {`${name} - ${Strings('label.maximum')} ${seat} ${Strings('label.passenger')}`}
                        </AppText>
                        {renderIf(total !== -1,
                            <AppText style={styles.estimatePrice}>{`Est: ~ ${Utils.formatVND(total)}`}</AppText>)}
                        {renderIf(discount > 0,
                            <AppText style={styles.previousPrice}>{Utils.formatVND(system)}</AppText>)}
                    </View>
                </View>
                {renderIf(note,
                    <View style={styles.itemFooter}>
                        <AppText style={styles.note}>{Utils.vehicleNote(symbol)}</AppText>
                    </View>)}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <PickerHeader
                navigation={navigation}
                title={Strings('label.select_vehicle_type')}
            />
            <FlatList
                style={{ padding: normalize(16) }}
                keyExtractor={keyGenerator}
                data={vehicles}
                renderItem={({ item }) => vehicle(item)}
            />
        </View>
    );
}
