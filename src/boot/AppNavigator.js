import { createAppContainer } from 'react-navigation';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { Transition } from 'react-native-reanimated';
import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import SplashScreen from '../ui/screens/splash/container';
import WelcomeScreen from '../ui/screens/welcome/WelcomeScreen';
import SignInScreen from '../ui/screens/auth/Login';
import ResetPassword from '../ui/screens/auth/ResetPassword';
import AccountList from '../ui/screens/auth/AccountList';
import BookingScreen from '../ui/screens/main/booking/container';
import TrackingScreen from '../ui/screens/main/tracking/container';
import ProfileScreen from '../ui/screens/main/profile/container';
import { Colors, Dimens } from '../commons';
import { normalize } from '../commons/utils';
import AppText from '../ui/components/text/AppTextView';
import AirportCarStep1 from '../ui/screens/main/booking/airporttransfer/step1';
import AirportBookingHeader from '../ui/components/header/authHeader/AirportBookingHeader';
import Strings from '../utils/LocalizationConfig';
import AirportPicker from '../ui/screens/main/booking/common/airport';
import LocationPicker from '../ui/screens/main/booking/common/location';
import VehiclePicker from '../ui/screens/main/booking/airporttransfer/step1/vehicle';
import RoutePicker from '../ui/screens/main/booking/airporttransfer/step1/route';
import PaymentPicker from '../ui/screens/main/booking/common/step3/payment';
import StatusTab from './navigation/StatusNavigation';
import BookingDetail, { CRRideDetail, UPRideDetail } from '../ui/screens/main/status/detail';
import ChangeBookingTime from '../ui/screens/main/status/edit';
import ActiveRideList from '../ui/screens/main/tracking/list';
import StatisticContainer from './navigation/StatisticNavigation';
import EditProfile from '../ui/screens/main/profile/editprofile';
import PlaceList from '../ui/screens/main/profile/placelist';
import TransactionStatus from '../ui/screens/main/profile/transactionstatus';
import Setting from '../ui/screens/main/profile/setting';
import ChangePassword from '../ui/screens/main/profile/changepassword';
import CarRentalBookingStack from './navigation/CarRentalNavigation';
import AirportStep3 from '../ui/screens/main/booking/airporttransfer/step3';
import AirportStep2 from '../ui/screens/main/booking/airporttransfer/step2';
import DeptDetail from '../ui/screens/main/profile/deptdetail';

const stackNavigationOption = {
    headerShown: false,
    ...TransitionPresets.SlideFromRightIOS,
};

const bookingStackNavigationTitle = (navigation) => {
    const { routeName } = navigation.state;
    switch (routeName) {
        case 'AirportStep1':
            return Strings('label.airport_transfer');
        case 'AirportStep2':
            return Strings('header.fill_in_contact');
        case 'AirportStep3':
        default:
            return Strings('header.confirm_booking');
    }
};

const bookingStackNavigationStep = (navigation) => {
    const { routeName } = navigation.state;
    switch (routeName) {
        case 'AirportStep1':
            return `${Strings('label.step')} 1/3`;
        case 'AirportStep2':
            return `${Strings('label.step')} 2/3`;
        default:
        case 'AirportStep3':
            return `${Strings('label.step')} 3/3`;
    }
};

const bookingStackNavigationOption = {
    ...stackNavigationOption,
    headerShown: true,
    header: ({ navigation }) => (
        <AirportBookingHeader
            navigation={navigation}
            title={bookingStackNavigationTitle(navigation)}
            step={bookingStackNavigationStep(navigation)}
        />
    ),
};

const bottomTabLabel = (route) => {
    switch (route) {
        case 'Booking':
            return Strings('tab.booking');
        case 'Status':
            return Strings('tab.status');
        case 'Tracking':
            return Strings('tab.tracking');
        case 'Report':
            return Strings('tab.report');
        default:
        case 'Profile':
            return Strings('tab.profile');
    }
};

const bottomTabIcon = (route) => {
    switch (route) {
        case 'Booking':
            return require('../assets/icons/ic_calendar.png');
        case 'Status':
            return require('../assets/icons/ic_menu.png');
        case 'Tracking':
            return require('../assets/icons/ic_tracking.png');
        case 'Report':
            return require('../assets/icons/ic_chart.png');
        default:
        case 'Profile':
            return require('../assets/icons/ic_profile.png');
    }
};

const bottomTabNavigationOption = (navigation) => ({
    tabBarIcon: ({ focused }) => (
        <Image
            source={bottomTabIcon(navigation)}
            style={{
                marginTop: normalize(4),
                paddingBottom: normalize(4),
                width: normalize(20),
                height: normalize(20),
                tintColor: focused ? Colors.COLOR_PRIMARY_1 : Colors.COLOR_NEUTRAL_3,
            }}
        />
    ),
    tabBarLabel: ({ focused }) => (
        <AppText
            style={{
                fontSize: Dimens.TEXT_SIZE_SUB_BODY,
                textAlign: 'center',
                color: focused ? Colors.COLOR_PRIMARY_1 : Colors.COLOR_NEUTRAL_3,
            }}
        >
            {bottomTabLabel(navigation)}
        </AppText>
    ),
});

const AuthStack = createStackNavigator(
    {
        SignIn: {
            screen: SignInScreen,
            navigationOptions: stackNavigationOption,
        },
        Welcome: {
            screen: WelcomeScreen,
            navigationOptions: stackNavigationOption,
        },
        ResetPassword: {
            screen: ResetPassword,
            navigationOptions: stackNavigationOption,
        },
        AccountList: {
            screen: AccountList,
            navigationOptions: stackNavigationOption,
        },
    }, {
        initialRouteName: 'Welcome',
    },
);

const AirportBookingStack = createStackNavigator({
    AirportStep1: {
        screen: AirportCarStep1,
        navigationOptions: bookingStackNavigationOption,
    },
    AirportStep2: {
        screen: AirportStep2,
        navigationOptions: bookingStackNavigationOption,
    },
    AirportStep3: {
        screen: AirportStep3,
        navigationOptions: bookingStackNavigationOption,
    },
    AirportPicker: {
        screen: AirportPicker,
        navigationOptions: {
            headerShown: false,
            ...TransitionPresets.ModalSlideFromBottomIOS,
        },
    },
    VehiclePicker: {
        screen: VehiclePicker,
        navigationOptions: {
            headerShown: false,
            ...TransitionPresets.ModalSlideFromBottomIOS,
        },
    },
    LocationPicker: {
        screen: LocationPicker,
        navigationOptions: {
            headerShown: false,
            ...TransitionPresets.ModalSlideFromBottomIOS,
        },
    },
    RoutePicker: {
        screen: RoutePicker,
        navigationOptions: {
            headerShown: false,
            ...TransitionPresets.ModalSlideFromBottomIOS,
        },
    },
    PaymentPicker: {
        screen: PaymentPicker,
        navigationOptions: {
            headerShown: false,
            ...TransitionPresets.ModalSlideFromBottomIOS,
        },
    },
}, {
    initialRouteName: 'AirportStep1',
    headerMode: 'screen',
});

const MainNavigation = createBottomTabNavigator(
    {
        Booking: {
            screen: BookingScreen,
            navigationOptions: ({ navigation }) => bottomTabNavigationOption(navigation.state.routeName),
        },
        Status: {
            screen: StatusTab,
            navigationOptions: ({ navigation }) => bottomTabNavigationOption(navigation.state.routeName),
        },
        Tracking: {
            screen: TrackingScreen,
            navigationOptions: ({ navigation }) => bottomTabNavigationOption(navigation.state.routeName),
        },
        Report: {
            screen: StatisticContainer,
            navigationOptions: ({ navigation }) => bottomTabNavigationOption(navigation.state.routeName),
        },
        Profile: {
            screen: ProfileScreen,
            navigationOptions: ({ navigation }) => bottomTabNavigationOption(navigation.state.routeName),
        },
    }, {
        initialRouteName: 'Booking',
        tabBarOptions: {
            style: {
                height: normalize(56),
                paddingVertical: normalize(8),
            },
        },
    },
);

const HomeNavigation = createStackNavigator({
    CarRentalBooking: {
        screen: CarRentalBookingStack,
        navigationOptions: stackNavigationOption,
    },
    AirportBooking: {
        screen: AirportBookingStack,
        navigationOptions: stackNavigationOption,
    },
    BookingDetail: {
        screen: BookingDetail,
        navigationOptions: stackNavigationOption,
    },
    ChangeBookingTime: {
        screen: ChangeBookingTime,
        navigationOptions: stackNavigationOption,
    },
    Main: {
        screen: MainNavigation,
        navigationOptions: stackNavigationOption,
    },
    ActiveRide: {
        screen: ActiveRideList,
        navigationOptions: stackNavigationOption,
    },
    EditProfile: {
        screen: EditProfile,
        navigationOptions: stackNavigationOption,
    },
    PlaceList: {
        screen: PlaceList,
        navigationOptions: stackNavigationOption,
    },
    UPRideDetail: {
        screen: UPRideDetail,
        navigationOptions: stackNavigationOption,
    },
    CRRideDetail: {
        screen: CRRideDetail,
        navigationOptions: stackNavigationOption,
    },
    TransactionStatus: {
        screen: TransactionStatus,
        navigationOptions: stackNavigationOption,
    },
    DeptDetail: {
        screen: DeptDetail,
        navigationOptions: stackNavigationOption,
    },
    Setting: {
        screen: Setting,
        navigationOptions: stackNavigationOption,
    },
    ChangePassword: {
        screen: ChangePassword,
        navigationOptions: stackNavigationOption,
    },
}, {
    initialRouteName: 'Main',
});

const AppNavigation = createAnimatedSwitchNavigator(
    {
        Splash: {
            screen: SplashScreen,
            navigationOptions: {
                header: null,
            },
        },
        AuthStack: {
            screen: AuthStack,
            navigationOptions: {
                header: null,
            },
        },
        Home: {
            screen: HomeNavigation,
            navigationOptions: {
                header: null,
            },
        },
    },
    {
        initialRouteName: 'Splash',
        transition: (
            <Transition.Together>
                <Transition.Out
                    type="slide-left"
                    durationMs={300}
                    interpolation="easeIn"
                />
                <Transition.In
                    type="slide-right"
                    durationMs={300}
                />
            </Transition.Together>
        ),
    },
);

export default createAppContainer(AppNavigation);
