import React from 'react';
import { StyleSheet } from 'react-native';
import AirportCarStep2 from '../../common/step2';

export default function AirportStep2({ navigation }) {
    return (
        <AirportCarStep2
            navigation={navigation}
            nextRoute="AirportStep3"
        />
    );
}

const styles = StyleSheet.create({});
