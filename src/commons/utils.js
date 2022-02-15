import { Dimensions, Linking, PixelRatio, Platform, View } from 'react-native';
import i18n from 'i18n-js';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import React from 'react';
import Strings, { translationGetters } from '../utils/LocalizationConfig';
import { Colors, Constants, Dimens, Storage, Utils } from './index';
import { DEPT_STATUS, ROUTE_FROM_AIRPORT } from './const';
import Snackbar from 'react-native-snackbar';

export const DEFAULT_TIME = '--:--';

const {
    width: SCREEN_WIDTH,
} = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;

export const normalize = (size: number): number => {
    const newSize = size * scale;
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    }
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

export function isFunction(func: any): boolean {
    return func && typeof func === 'function';
}

export function changeLanguage(language: string) {
    Strings.cache.clear();
    i18n.locale = language;
    i18n.translations = { [language]: translationGetters[language]() };
}

export function isNullOrUndefined(param) {
    return param === null
        || param === undefined
        || param === ''
        || param.length <= 0;
}

/**
 *
 * Check if current user data has been stored in async storage or not
 */
export async function checkAndStorageQuickLoginData(quickLoginData: any) {
    let userList = await Storage.getDataJson(Constants.KEY_PREVIOUS_USER_LIST);
    if (userList && userList.length > 0) {
        let found = false;
        userList = userList.map((item: any): any => {
            if (item.email === quickLoginData.email) {
                found = true;
                item = quickLoginData;
            }
            return item;
        });
        if (!found) {
            userList.push(quickLoginData);
        }
        await Storage.setDataJson(Constants.KEY_PREVIOUS_USER_LIST, userList);
    } else {
        userList = [];
        userList.push(quickLoginData);
        await Storage.setDataJson(Constants.KEY_PREVIOUS_USER_LIST, userList);
    }
}

export default function renderIf(condition: boolean, content: any): any {
    if (condition) {
        return content;
    }
    return null;
}

export function showToast(message: string) {
    Toast.show(message, Toast.SHORT);
}

export function invokeIfDataIsNull(data, invokeFunction) {
    if (data) return;
    invokeFunction();
}

export function invokeIfDataIsEmpty(data, invokeFunction) {
    if (data && data.length > 0) {
        return;
    }
    invokeFunction();
}

export function getParamFromNavigation(navigation, paramName) {
    const { params } = navigation.state;

    if (params) {
        return params[paramName];
    }
    return null;
}

export function getAllParamFromNavigation(navigation) {
    const { params } = navigation.state;
    return params;
}

export function formatDate(date, format, locale = 'en') {
    return moment(date).locale(locale).format(format);
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function calculateDateDiff(start, end) {
    return Math.abs(moment(start).startOf('days').diff(moment(end), 'days'));
}

export function calculateMinuteDiff(start, end) {
    return Math.abs(moment(start).diff(moment(end), 'minute'));
}

export function parseDate(date, format) {
    return moment(date, format);
}

export const iconTintColor = (service) => {
    switch (service) {
        case 'CR':
            return Colors.COLOR_SECONDARY_4;
        case 'UP':
            return Colors.COLOR_PRIMARY_1;
        default:
            return Colors.COLOR_SECONDARY;
    }
};

export function vehicleIcon(vehicle, service = '') {
    if (service === 'CR') {
        return require('../assets/icons/ic_car_rental.png');
    }
    if (service === 'DE') {
        return require('../assets/icons/ic_luggage.png');
    }
    switch (vehicle) {
        case 'sedan':
            return require('../assets/icons/ic_sedan.png');
        case 'suv':
            return require('../assets/icons/ic_suv.png');
        case 'minivan':
            return require('../assets/icons/ic_minivan.png');
        default:
        case 'hatchback':
            return require('../assets/icons/ic_hatchback.png');
    }
}

export const vehicleNote = (type: string): string => {
    if (type === 'luxcar') {
        return Strings('label.premium_vehicle_type_description');
    }
    if (type === 'hatchback') {
        return Strings('label.hatchback_vehicle_type_description');
    }
    if (type === 'sedan') {
        return Strings('label.sedan_vehicle_type_description');
    }
    return '';
};

export const formatDotSeparateNumber = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const formatVND = (x: number): string => ((x !== null && x !== undefined) ? formatDotSeparateNumber(x).concat(' ₫') : '');

export const routeTypeTitle = (r) => {
    if (r === ROUTE_FROM_AIRPORT) {
        return Strings('label.route_from_airport');
    }
    return Strings('label.route_to_airport');
};

export const getFormError = (errors) => {
    if (Utils.isNullOrUndefined(errors)) {
        return ['', ''];
    }
    const splits = Object.keys(errors).map((key) => [key, errors[key].message]);
    return (splits.length === 0) ? ['', null] : splits[0];
};

export const statusTabHeader = (key: string): string => {
    let header = '';
    switch (key) {
        case 'BookingStatus':
            header = Strings('tab.status_booked');
            break;
        case 'AcceptStatus':
            header = Strings('tab.status_assigned');
            break;
        default:
        case 'CompleteStatus':
            header = Strings('tab.status_completed');
            break;
    }
    return header;
};

export const statisticTabHeader = (key) => {
    let header = '';
    switch (key) {
        case 'Daily':
            header = Strings('tab.statistics_daily');
            break;
        case 'Monthly':
            header = Strings('tab.statistics_monthly');
            break;
        default:
        case 'Yearly':
            header = Strings('tab.statistics_yearly');
            break;
    }
    return header;
};

export const displaySerial = (data: any): string => `${data.trip_type}${data.serial}`;

export function makePhoneCall(phone) {
    Linking.openURL(`tel:${phone}`);
}

const round = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

const region = (mapSize, latitude, longitude, lat, lng, paddingLatitude = 0, paddingLongitude = 0) => {
    if (lat && lng) {
        let { width = 0, height = 0 } = mapSize;

        let latDelta = Math.abs(lat - latitude);
        let lngDelta = Math.abs(lng - longitude);

        let latitudeDelta, longitudeDelta;
        if (latDelta > lngDelta) {
            latitudeDelta = latDelta;
            longitudeDelta = (latDelta * height) / width || 1;
        } else {
            longitudeDelta = lngDelta;
            // (height || 1) to prevent height === 0 when map is initialize
            latitudeDelta = (lngDelta * width) / (height || 1);
        }
        return {
            latitude: (latitude + lat) / 2,
            longitude: (longitude + lng) / 2,
            latitudeDelta: round(latitudeDelta * 1.5 + (2 * paddingLatitude)),
            longitudeDelta: round(longitudeDelta * 1.5 + (2 * paddingLongitude)),
        };
    }
    return {
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };
};

export function calculateRegion(mapSize, driver, destination) {
    if (driver) {
        if (destination) {
            return region(
                mapSize,
                destination.latitude,
                destination.longitude,
                driver.latitude,
                driver.longitude,
            );
        }
        return region(
            mapSize,
            driver.latitude,
            driver.longitude,
        );
    }
    return null;
}

export function invokeFunction(f) {
    if (f) {
        if (typeof f === 'function') {
            f();
        } else {
            console.warn(`${f} is not a function`);
        }
    }
}

export function showSnackbar(text: string, onPress: Function) {
    Snackbar.show({
        title: text,
        duration: Snackbar.LENGTH_SHORT,
        action: (onPress) ? {
            title: Strings('label.call'),
            textColor: Colors.COLOR_GREEN,
            onPress,
        } : null,
    });
}

export const topTabBarDefaultOptions = (getHeader) => ({
    labelStyle: {
        fontFamily: Constants.DEFAULT_FONT_REGULAR,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
    },
    upperCaseLabel: false,
    activeTintColor: Colors.COLOR_BLACK,
    inactiveTintColor: Colors.COLOR_NEUTRAL_3,
    indicatorStyle: {
        backgroundColor: Colors.COLOR_LIGHT_BLUE,
    },
    style: {
        elevation: 2,
        backgroundColor: Colors.COLOR_WHITE,
    },
    renderIndicator: (route: any): any => {
        let { index, routes } = route.navigationState;
        // console.log('route::', route.navigationState);
        let { key } = routes[index];
        let header = getHeader(key);
        return (
            <View style={{ flex: 1, flexDirection: 'column-reverse' }}>
                <View style={{ flexDirection: 'row', width: '100%', height: 3 }}>
                    <View style={{ flex: index }} />
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <View style={{
                            width: header.length * 10,
                            backgroundColor: Colors.COLOR_BLACK,
                            height: '100%',
                        }}
                        />
                    </View>
                    <View style={{ flex: 3 - index - 1 }} />
                </View>
            </View>
        );
    },
});

export function isPaid(status: string): boolean {
    return status && status === DEPT_STATUS.COMPLETE;
}

export const getPaymentMethodIcon = (pm: string): any => {
    switch (pm) {
        case 'debt':
            return Constants.debtPayment.icon;
        case 'cash':
            return Constants.payWithCash.icon;
        default:
            return Constants.payOnline.icon;
    }
};

export const getPaymentMethod = (pm: string) => {
    switch (pm) {
        case 'debt':
            return Constants.debtPayment['name_'.concat(Strings('language'))];
        case 'cash':
            return Constants.payWithCash['name_'.concat(Strings('language'))];
        default:
            return Constants.payOnline['name_'.concat(Strings('language'))];
    }
};
//
export const isDateTimeValid = (date, time) => {
    const dateString = Utils.formatDate(date, 'DD/MM/YYYY');
    const timeString = time ? formatDate(time, 'HH : mm') : DEFAULT_TIME;
    const selectedDateTime = parseDate(`${dateString} ${timeString}`, 'DD/MM/YYYY HH : mm');
    const valid = !(calculateDateDiff(new Date(), date) === 0 && selectedDateTime.isBefore(moment()));
    return valid ? selectedDateTime.toDate() : null;
};
export const routeTime = (date, time) => {
    if (!date || !time) return '';
    const dateString = Utils.formatDate(date, 'ddd, DD MMM YYYY');
    const timeString = Utils.formatDate(time, 'HH:mm');
    return `${timeString} - ${dateString}`;
};

export const routeVehicle = (vehicle) => (
    vehicle ? `${vehicle.name} - ${Strings('label.maximum')} ${vehicle.seat} ${Strings('label.passenger')}` : ''
);

export const getSeat = (vehicle) => {
    switch (vehicle) {
        case 'sedan':
        case 'hatchback':
            return 3;
        case 'suv':
            return 5;
        default:
        case 'minivan':
            return 8;
    }
};
