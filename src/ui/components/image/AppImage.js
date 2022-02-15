import React from 'react';
import { Image, StyleSheet } from 'react-native';

const imageSource = {
    ic_error_time: require('../../../assets/icons/ic_error_time.png'),
    ic_information: require('../../../assets/icons/ic_information.png'),
};

const getImageSource = (source) => imageSource[source] || require('../../../assets/icons/ic_setting.png');

export default function AppImage({ source, style, ...props }) {
    return (
        <Image
            source={getImageSource(source)}
            style={[{ resizeMode: 'contain' }, style]}
            {...props}
        />
    );
}

const styles = StyleSheet.create({});
