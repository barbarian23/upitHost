import React, { Component } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import AppText from '../../../components/text/AppTextView';
import Strings from '../../../../utils/LocalizationConfig';
import styles from './styles';
import { Colors, Utils } from '../../../../commons';

// TODO: Add timeout after navigate to result screen of booking flow

const BOOKING_OPTIONS = () => [
    {
        id: 'airport',
        title: Strings('label.airport_transfer'),
        image: require('../../../../assets/icons/ic_airport_car.png'),
        color: Colors.COLOR_PRIMARY,
        background: Colors.COLOR_NEUTRAL_5,
    },
    {
        id: 'luggage',
        title: Strings('label.luggage_delivery'),
        image: require('../../../../assets/icons/ic_luggage.png'),
        color: Colors.COLOR_SECONDARY,
        background: Colors.COLOR_SECONDARY_3,
    },
    {
        id: 'guide',
        title: Strings('label.driver_guide'),
        image: require('../../../../assets/icons/ic_driver_guide.png'),
        color: Colors.COLOR_SECONDARY_4,
        background: Colors.COLOR_SECONDARY_5,
    },
];

export default class BookingScreen extends Component {
    componentDidMount() {
        this.getProfileDataFromProps();
    }

    renderWelcomeSection() {
        const { profile, profileLoading } = this.props;
        let name = '';
        if (profileLoading) {
            name = '...';
        } else if (profile != null) {
            name = profile.name;
        }

        return (
            <View>
                <AppText style={styles.helloTitle}>{`${Strings('label.hello')} ${name},`}</AppText>
                <AppText style={styles.helloMessage}>{Strings('label.hello_message')}</AppText>
            </View>
        );
    }

    renderBookingOptions() {
        return (
            <View style={styles.bookingOptionContainer}>
                {BOOKING_OPTIONS().map((option) => this.bookingOption(option))}
            </View>
        );
    }

    bookingOption = (option) => (
        <TouchableOpacity
            key={option.title}
            style={styles.option}
            onPress={() => this.navigateToBookingModule(option.id)}
        >
            <View style={styles.optionImageContainer(option.background)}>
                <Image
                    style={styles.optionImage(option.color)}
                    source={option.image}
                />
            </View>
            <AppText bold style={styles.optionTitle}>{option.title}</AppText>
        </TouchableOpacity>
    );

    render() {
        return (
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    {this.renderWelcomeSection()}
                    {this.renderBookingOptions()}
                </View>
            </ScrollView>
        );
    }

    getProfileDataFromProps() {
        const { profile, getProfile } = this.props;

        Utils.invokeIfDataIsNull(profile, () => getProfile());
    }

    navigateToBookingModule(id) {
        const { navigation } = this.props;

        if (id === 'airport') {
            navigation.navigate('AirportStep1');
        } else if (id === 'guide') {
            navigation.navigate('CarRentalBooking');
        } else {
            Utils.showToast(Strings('message.not_support'));
        }
    }
}
