import React, { useState } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import AppText from '../text/AppTextView';
import renderIf from '../../../commons/utils';
import { Colors } from '../../../commons';

const computeInputStyle = (props) => {
    const { inputContainerStyle } = props;
    let defaultContainerStyle = [
        styles.input,
    ];
    defaultContainerStyle = [...defaultContainerStyle, inputContainerStyle];
    return defaultContainerStyle;
};

const computeInputContainerStyle = (props, focus) => {
    let defaultInputContainerStyle = [
        styles.inputContainer,
    ];
    defaultInputContainerStyle = [...defaultInputContainerStyle, (focus) ? styles.inputFocus : styles.inputBlur];
    return defaultInputContainerStyle;
};

const computeContainerStyle = (props) => {
    const { containerStyle } = props;
    let defaultContainerStyle = [
        styles.container,
    ];
    defaultContainerStyle = [...defaultContainerStyle, containerStyle];
    return defaultContainerStyle;
};

export default React.forwardRef((props, ref) => {
    const { label, labelStyle, error, passwordField, secureTextEntry, ...inputProps } = props;

    const [focus, setFocus] = useState(false);
    const [secureTextEnable, setSecureTextEnable] = useState(true);

    function toggleSecureTextModeSrc() {
        return (secureTextEnable)
            ? require('../../../assets/icons/ic_eye_close.png')
            : require('../../../assets/icons/ic_eye_off.png');
    }

    const passwordVisibleOnPress = () => setSecureTextEnable(!secureTextEnable);
    const passwordVisibleButton = () => (
        <TouchableOpacity
            onPress={passwordVisibleOnPress}
            style={styles.passwordVisibleButton}
        >
            <Image
                source={toggleSecureTextModeSrc()}
                style={styles.passwordVisibleImage}
            />
        </TouchableOpacity>
    );

    return (
        <View style={computeContainerStyle(props)}>
            {label && <AppText style={styles.label}>{label}</AppText>}
            <View style={computeInputContainerStyle(props, focus)}>
                <TextInput
                    placeholderTextColor={Colors.COLOR_NEUTRAL_3}
                    allowFontScaling={false}
                    autoCapitalize="none"
                    ref={ref}
                    style={computeInputStyle(props, focus)}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    secureTextEntry={passwordField && secureTextEnable}
                    {...inputProps}
                />
                {renderIf(passwordField, passwordVisibleButton())}
            </View>
            {renderIf(error, <AppText style={styles.error}>{error}</AppText>)}
        </View>
    );
});
