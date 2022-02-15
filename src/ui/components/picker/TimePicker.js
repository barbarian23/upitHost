import React from 'react';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Appearance } from 'react-native-appearance';
import PropTypes from 'prop-types';

function TimePicker(props) {
    let { time, isVisible, onConfirm, onCancel } = props;
    const colorScheme = Appearance.getColorScheme();

    return (
        <DateTimePicker
            is24Hour
            isDarkModeEnabled={colorScheme === 'dark'}
            date={time}
            isVisible={isVisible}
            mode="time"
            onConfirm={(t) => onConfirm(t)}
            onCancel={() => onCancel()}
        />
    );
}

TimePicker.propTypes = {
    time: PropTypes.instanceOf(Date).isRequired,
    isVisible: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
};

TimePicker.defaultProps = {
    onConfirm: () => {
    },
    onCancel: () => {
    },
};

export default TimePicker;
