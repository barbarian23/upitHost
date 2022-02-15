import React from 'react';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Appearance } from 'react-native-appearance';
import PropTypes from 'prop-types';

function DatePicker(props) {
    const { date, isVisible, onConfirm, onCancel } = props;
    const colorScheme = Appearance.getColorScheme();
    return (
        <DateTimePicker
            isDarkModeEnabled={colorScheme === 'dark'}
            date={date}
            isVisible={isVisible}
            minimumDate={new Date()}
            mode="date"
            onConfirm={(d) => onConfirm(d)}
            onCancel={() => onCancel()}
        />
    );
}

DatePicker.propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    isVisible: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
};

DatePicker.defaultProps = {
    onConfirm: () => {
    },
    onCancel: () => {
    },
};

export default DatePicker;
