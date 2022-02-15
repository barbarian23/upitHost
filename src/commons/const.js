import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Strings from '../utils/LocalizationConfig';

export const VERSION = () => DeviceInfo.getVersion();

export const ROUTE_TO_AIRPORT = 0;
export const ROUTE_FROM_AIRPORT = 1;

export const HOTLINE_PHONE = '0966710686';
export const STATUS_BOOKING = 'booking';
export const STATUS_CONFIRM = 'confirm';
export const STATUS_COMPLETE = 'complete';

export const DAILY = 'day';
export const WEEKLY = 'week';
export const MONTHLY = 'month';
export const YEARLY = 'year';

export const NOTIFY_BOOK = 'notify_book';
export const NOTIFY_ACCEPT = 'notify_accept';
export const NOTIFY_COMPLETE = 'notify_complete';
export const NOTIFY_LOCATION_DRIVER = 'notify_location_driver';
export const NOTIFY_UPDATE = 'notify_update';
export const NOTIFY_PSG_PICKED_UP = 'notify_confirm_riding';

export const SALE_POINT_PATH = 'salepoints/';
export const HOUSE_PATH = 'houses/';
export const SYSTEM_PATH = 'systems/';

// export const BASE_URL = 'https://serverdev.upit.asia/api/'; // DEV
// export const BASE_URL = 'http://107.113.194.139:3200/api/'; // LOCAL
export const BASE_URL = 'https://server.upit.asia/api/'; // RELEASE

export const API_GET_IMAGE_URL = (imageName) => `${BASE_URL}image/salepoints/${imageName}`;
export const DEFAULT_IMAGE_URL = 'https://s3.amazonaws.com/37assets/svn/765-default-avatar.png';

export const GOOGLE_KEY = {
    android: 'AIzaSyAUV5LnOgtdoYifLSmT8ijG85q6R4cDYyw',
    ios: 'AIzaSyDTdiD4_aF9EETNqKodXxZ3WOMWhS2HKrU',
};

// Test
// export const VTC_PAYMENT_INFO = {
//     APP_ID: "500049057",
//     ACCOUNT_NAME: "0963465816",
//     APP_SECRET: "Sopa@123",
//     RECEIVE_ACCOUNT: "0963465816"
// };

// Live
export const VTC_PAYMENT_INFO = {
    APP_ID: '500004524',
    ACCOUNT_NAME: '0349595928',
    APP_SECRET: 'abc@13579',
    RECEIVE_ACCOUNT: '0349595928',
};

export const DURATION = [
    {
        id: 1,
        title: 'label.duration_morning_title',
        description: 'label.duration_morning_description',
        from: 7,
        to: 12,
        request: 'first_half',
    },
    {
        id: 2,
        title: ('label.duration_afternoon_title'),
        description: ('label.duration_afternoon_description'),
        from: 12,
        to: 17,
        request: 'second_half',
    },
    {
        id: 3,
        title: ('label.duration_all_day_title'),
        description: ('label.duration_all_day_description'),
        from: 7,
        to: 17,
        request: 'one_day',
    },
];

export const CARRENTAL_CAR_TYPE = {
    sedan: {
        name: 'SEDAN',
        symbol: 'sedan',
        seat: 5,
        available: true,
        note: 'Xe cốp rộng',
        icon: require('../assets/icons/ic_sedan.png'),
    },
    suv: {
        name: 'SUV',
        symbol: 'suv',
        seat: 7,
        available: true,
        note: 'Xe cốp nhỏ',
        icon: require('../assets/icons/ic_suv.png'),
    },
    minivan: {
        name: 'MINIVAN',
        symbol: 'minivan',
        seat: 16,
        available: true,
        note: 'Xe cốp nhỏ',
        icon: require('../assets/icons/ic_minivan.png'),
    },
};

const LAT_LNG = (latLng) => `${latLng.latitude},${latLng.longitude}`;
const KEY = `${(Platform.OS === 'ios' ? GOOGLE_KEY.ios : GOOGLE_KEY.android)}`;

const GEOCODE_BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
export const GET_PLACE_FROM_GEOCODE = (latLng) => `${GEOCODE_BASE_URL}?latlng=${LAT_LNG(latLng)}&key=${KEY}`;

const DIRECTION_BASE_URL = 'https://maps.googleapis.com/maps/api/directions/json';
export const GET_DIRECTION_FROM_GEOCODE = (o, d) => `${DIRECTION_BASE_URL}?origin=${LAT_LNG(o)}&destination=${LAT_LNG(d)}&key=${KEY}`;

export const GET_PRICE_PATH = `${SYSTEM_PATH}getPrice`;
export const SIGN_IN_PATH = `${SALE_POINT_PATH}signin`;
export const GET_HOUSE_LIST_PATH = `${SALE_POINT_PATH}getLinkHouses`;
export const GET_PRICE_BY_LOCATION_PATH = `${HOUSE_PATH}getPrice`;
export const GET_PRICE_BY_HOUSE_PATH = `${HOUSE_PATH}getPriceByLocation`;
// export const SALE_POINT_BOOKING = `${SALE_POINT_PATH}book`;
export const SALE_POINT_BOOKING = `${SALE_POINT_PATH}bookTrip`;
export const PAYMENT_CALLBACK = 'payment/mobilecallback';
export const SYSTEM_BOOK_CAR_RENTAL = `${SALE_POINT_PATH}bookCarRental`;

export const SYSTEM_GET_PRICE_CAR_RENTAL = 'systems/getPriceCarRental';
export const SYSTEM_CHECK_LOCATION_SUPPORTED = '/systems/checkLocationSupported';

export const REGISTER_LISTENING_LOCATION = 'firebase_locations/signListenLocation';
export const SALE_POINT_LUGGAGE_DELIVERY = 'salepoints/bookDelivery';
export const SALE_POINT_TRIP_STATUS = `${SALE_POINT_PATH}getTripStatusBySalepoint`;
export const UPDATE_TIME_PATH = `${SALE_POINT_PATH}updateTime`;
export const GET_TRIP_DETAIL = `${SALE_POINT_PATH}getTripInfo`;

export const GET_STATISTIC_PATH = `${SALE_POINT_PATH}getAllPrice`;
export const GET_ALL_TRIP_COMPLETE_PATH = `${SALE_POINT_PATH}getAllTripCompleteByTime`;
export const GET_DEPT_LIST_PATH = 'deptqueues/listdeptSalepoint';
export const GET_CURRENT_DEPT = 'deptqueues/currentDeptSalepoint';
export const EDIT_INFO = `${SALE_POINT_PATH}editInfo`;
export const GET_INFO = `${SALE_POINT_PATH}getInfo`;
export const UPLOAD_AVATAR = `${SALE_POINT_PATH}updateAvatar`;
export const LOGOUT = `${SALE_POINT_PATH}signout`;
export const CHECK_TOKEN_EXPIRATION = 'checkToken';
export const FORGET_PASSWORD_PATH = `${SALE_POINT_PATH}forgetPassword`;
export const CHANGE_PASSWORD_PATH = `${SALE_POINT_PATH}changePassword`;
export const GET_EXTRA_PRICE_SUPPLIER = (time, airport, vehicle): string => `${HOUSE_PATH}/getExtraPriceSupplier?time_leave=${time}&airport_symbol=${airport}&vehicle_type=${vehicle}`;
export const GET_AIRPORT = `${HOUSE_PATH}getAllAirport`;
export const GET_PRICE_DELIVERY = 'systems/getPriceDelivery';

// key AsyncStorage
export const KEY_PREVIOUS_USER_LIST = 'user_list';
export const KEY_USER = 'user';
export const KEY_ACCESS_TOKEN = 'token';
export const KEY_FIREBASE_FCM_TOKEN = 'fcmToken';
export const KEY_PAYMENT_METHOD = 'payment_method';
export const KEY_AIRPORT = 'last_airport';
export const KEY_PAYMENT_INSTRUCTION = 'payment_instruction';
export const KEY_LANGUAGE = 'language';

export const COMMON_DATE_FORMAT = 'DD/MM/YYYY';
export const COMMON_TIME_FORMAT = 'hh:mm A';
export const COMMON_MOMENT_FORMAT = `${COMMON_DATE_FORMAT} ${COMMON_TIME_FORMAT}`;

export const SERVER_TIME_DATE_FORMAT = 'hh:mm - DD/MM/YYYY';
export const SERVER_REVERSE_TIME_DATE_FORMAT = 'MM/DD/YYYY hh:mm';

export const SERVER_TIME_FORMAT = 'hh:mm';
export const SERVER_DATE_FORMAT = 'DD/MM/YYYY';

export const EDIT_TIME_FORMAT = 'hh:mm A';
export const EDIT_DATE_FORMAT = 'MM/DD/YYYY';

export const DEPT_STATUS = {
    CREATED: 'CREATED',
    COMPLETE: 'COMPLETE',
};

export const HTTPStatus = {
    UNAUTHORIZED: 401,
    CURRENT_VERSION_NEED_TO_UPDATE: 456,
    LOCATION_NOT_SUPPORTED: 406,
};

export const DEFAULT_FONT = 'Inter';
export const DEFAULT_FONT_REGULAR = DEFAULT_FONT.concat('-Medium');
export const DEFAULT_FONT_BOLD = DEFAULT_FONT.concat('-SemiBold');
export const DEFAULT_FONT_ITALIC = DEFAULT_FONT.concat('-Italic');
export const DEFAULT_FONT_BOLD_ITALIC = DEFAULT_FONT.concat('-BoldItalic');

export const language = [
    {
        id: 1,
        language: 'label.english',
        code: 'en',
        // image: require('../assets/icons/ic_nf_uk.png'),
        shortName: 'ENG',
    },
    {
        id: 2,
        language: 'label.vietnamese',
        code: 'vi',
        // image: require('../assets/icons/ic_nf_vietnam.png'),
        shortName: 'VIE',

    },
];

/**
 * Payment method
 */
export const payWithCash = {
    id: 1,
    name_vi: 'Trả tiền mặt',
    name_en: 'Pay with cash',
    short_name_vi: 'Tiền mặt',
    short_name_en: 'Cash',
    icon: require('../assets/icons/ic_round_dollar.png'),
    requestName: 'cash',
};

export const payOnline = {
    id: 2,
    name_vi: 'Thanh toán online',
    name_en: 'Pay online',
    description_vi: 'VTC Pay',
    description_en: 'VTC Pay',
    short_name_vi: 'Online',
    short_name_en: 'Online',
    icon: require('../assets/icons/ic_credit_card.png'),
    requestName: 'pay_online',
};

export const debtPayment = {
    id: 3,
    name_vi: 'Công nợ cuối tháng',
    name_en: 'Dept',
    short_name_vi: 'Công nợ',
    short_name_en: 'Dept',
    icon: require('../assets/icons/ic_dept.png'),
    requestName: 'debt',
};
