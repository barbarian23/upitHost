import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import React from 'react';
import CarRentalStep1 from '../../ui/screens/main/booking/carrental/step1';
import VehiclePicker from '../../ui/screens/main/booking/airporttransfer/step1/vehicle';
import PaymentPicker from '../../ui/screens/main/booking/common/step3/payment';
import AirportBookingHeader from '../../ui/components/header/authHeader/AirportBookingHeader';
import Strings from '../../utils/LocalizationConfig';
import DurationPicker from '../../ui/screens/main/booking/carrental/step1/duration/DurationPicker';
import LocationPicker from '../../ui/screens/main/booking/common/location';
import CarRentalStep3 from '../../ui/screens/main/booking/carrental/Step3';
import CarRentalStep2 from '../../ui/screens/main/booking/carrental/step2';

const stackNavigationOption = {
    headerShown: false,
    ...TransitionPresets.SlideFromRightIOS,
};

const bookingStackNavigationTitle = (navigation) => {
    const { routeName } = navigation.state;
    switch (routeName) {
        case 'Step1':
            return Strings('header.car_rental');
        case 'Step2':
            return Strings('header.fill_in_contact');
        case 'Step3':
        default:
            return Strings('header.confirm_booking');
    }
};

const bookingStackNavigationStep = (navigation) => {
    const { routeName } = navigation.state;
    switch (routeName) {
        case 'Step1':
            return `${Strings('label.step')} 1/3`;
        case 'Step2':
            return `${Strings('label.step')} 2/3`;
        default:
        case 'Step3':
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

const CarRentalBookingStack = createStackNavigator({
    Step1: {
        screen: CarRentalStep1,
        navigationOptions: bookingStackNavigationOption,
    },
    Step2: {
        screen: CarRentalStep2,
        navigationOptions: bookingStackNavigationOption,
    },
    Step3: {
        screen: CarRentalStep3,
        navigationOptions: bookingStackNavigationOption,
    },
    LocationPicker: {
        screen: LocationPicker,
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
    PaymentPicker: {
        screen: PaymentPicker,
        navigationOptions: {
            headerShown: false,
            ...TransitionPresets.ModalSlideFromBottomIOS,
        },
    },
    DurationPicker: {
        screen: DurationPicker,
        navigationOptions: {
            headerShown: false,
            ...TransitionPresets.ModalSlideFromBottomIOS,
        },
    },
}, {
    initialRouteName: 'Step1',
    headerMode: 'screen',
});

export default CarRentalBookingStack;
