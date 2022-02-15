import { Image, TouchableOpacity, View } from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import styles from './styles';
import AppText from '../../text/AppTextView';
import { normalize } from '../../../../commons/utils';
import { clearBookingData } from '../../../screens/main/booking/common/BookingAction';

export default function AirportBookingHeader(props) {
    const dispatch = useDispatch();

    const {
        navigation,
        title,
        leftIcon = require('../../../../assets/icons/ic_left_arrow.png'),
        step,
    } = props;

    return (
        <View style={styles.header}>
            <TouchableOpacity
                style={{ width: normalize(70) }}
                onPress={() => {
                    if (!navigation.isFirstRouteInParent()) {
                        navigation.goBack();
                        return;
                    }
                    dispatch(clearBookingData());
                    navigation.dangerouslyGetParent().goBack();
                }}
            >
                <Image
                    source={leftIcon}
                    style={styles.backButton}
                />

            </TouchableOpacity>
            <AppText numberOfLines={1} bold style={styles.headerTitle}>{title}</AppText>
            <AppText style={styles.step}>{step}</AppText>
        </View>
    );
}

AirportBookingHeader.propTypes = {
    navigation: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
};

AirportBookingHeader.defaultProps = {};
