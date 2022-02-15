import React from 'react';
import { StyleSheet } from 'react-native';
import AirportCarStep2 from '../../common/step2';

export default function CarRentalStep2({ navigation }) {
    return (
        <AirportCarStep2
            navigation={navigation}
            nextRoute="Step3"
        />
    );
}

const styles = StyleSheet.create({});
