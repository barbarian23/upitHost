import { Image, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import React from 'react';
import styles from '../styles';
import AppText from '../../../../components/text/AppTextView';
import renderIf, { normalize } from '../../../../../commons/utils';
import { Utils } from '../../../../../commons';

export default function RideSummaryInformation({ ride, onPress, rightButtonVisible, selected = false }) {
    const timeLeaveDate = ride ? moment(ride.time_leave, 'HH:mm - DD/MM/YYYY') : null;
    const timeLeave = timeLeaveDate ? Utils.formatDate(timeLeaveDate, 'HH:mm - ddd, DD MMM YYYY') : '';

    const serial = ride ? Utils.displaySerial(ride) : '';
    const nameCustomer = ride ? ride.name_customer : '';
    const icon = ride ? Utils.vehicleIcon(ride.vehicle_type, ride.trip_type) : '';

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.rideInformation, selected ? styles.selectedRide : {}]}
        >
            <View
                style={styles.imageContainer}
            >
                <Image
                    style={[styles.rideInformationImage, { tintColor: Utils.iconTintColor(ride.trip_type) }]}
                    source={icon}
                />
            </View>

            <View style={styles.rideInformationTextPartContainer}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <AppText
                        numberOfLines={1}
                        style={styles.rideInformationSerial}
                    >
                        {`#${serial} `}
                        <AppText
                            numberOfLines={1}
                        >
                            {`- ${nameCustomer}`}
                        </AppText>
                    </AppText>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: normalize(8) }}>
                        <Image
                            style={styles.timeIcon}
                            source={require('../../../../../assets/icons/ic_bxs_time.png')}
                        />
                        <AppText style={styles.timeText}>
                            {timeLeave}
                        </AppText>
                    </View>
                </View>
            </View>
            {renderIf(rightButtonVisible, (
                <View
                    style={{ justifyContent: 'center' }}
                >
                    <Image
                        style={{ width: normalize(24), height: normalize(24) }}
                        source={require('../../../../../assets/icons/ic_right_arrow.png')}
                    />
                </View>
            ))}
        </TouchableOpacity>
    );
}
