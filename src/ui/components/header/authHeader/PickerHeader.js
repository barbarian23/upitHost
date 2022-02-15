import React from 'react';
import AirportBookingHeader from './AirportBookingHeader';

export default function PickerHeader(props) {
    return (
        <AirportBookingHeader
            {...props}
            leftIcon={require('../../../../assets/icons/ic_close.png')}
        />
    );
}
