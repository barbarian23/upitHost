import { Image, TouchableOpacity, View } from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles';

export default function AuthHeader(props) {
    const { navigation } = props;
    return (
        <View style={styles.header}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
            >
                <Image
                    source={require('../../../../assets/icons/ic_left_arrow.png')}
                    style={styles.backButton}
                />
            </TouchableOpacity>
        </View>
    );
}

AuthHeader.propTypes = {
    navigation: PropTypes.object.isRequired,
};

AuthHeader.defaultProps = {

};
