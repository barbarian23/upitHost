import React, { useState } from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import AppText from '../text/AppTextView';
import renderIf, { normalize } from '../../../commons/utils';
import { Colors, Constants, Dimens } from '../../../commons';
import Strings from '../../../utils/LocalizationConfig';

const styles = StyleSheet.create({
    inputContainer: {
        borderRadius: normalize(5),
        paddingVertical: normalize(8),
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        alignItems: 'center',
    },
    input: {
        paddingVertical: 0,
        paddingStart: normalize(16),
        fontSize: Dimens.TEXT_SIZE_BODY,
        fontFamily: Constants.DEFAULT_FONT,
        flex: 1,
        color: Colors.COLOR_NEUTRAL_1,
    },
    container: {
        flexDirection: 'column',
    },
    inputFocus: {
        borderBottomColor: Colors.COLOR_PRIMARY_1,
    },
    inputBlur: {
        borderBottomColor: Colors.COLOR_NEUTRAL_3,
    },
    error: {
        marginStart: normalize(40),
        color: Colors.COLOR_SEMATIC,
        marginTop: normalize(8),
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
    },
    label: {
        color: Colors.COLOR_BLACK,
        fontSize: Dimens.TEXT_SIZE_BODY,
    }
});

const computeInputStyle = (props) => {
    const { inputStyle } = props;
    let defaultContainerStyle = [
        styles.input,
    ];
    defaultContainerStyle = [...defaultContainerStyle, inputStyle];
    return defaultContainerStyle;
};

const computeInputContainerStyle = (props, focus) => {
    const { inputContainer } = props;
    let defaultInputContainerStyle = [
        styles.inputContainer,
    ];
    defaultInputContainerStyle = [...defaultInputContainerStyle, inputContainer];
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

const renderInputIcon = (icon) => (
    renderIf(icon,
        <Image
            source={icon}
            style={{
                width: normalize(20),
                height: normalize(20),
                marginTop: normalize(4),
                marginLeft: normalize(4),
                resizeMode: 'contain',
            }}
        />)
);

const renderInputRightLabel = (label) => (
    renderIf(label,
        <AppText bold style={{ color: Colors.COLOR_NEUTRAL_1, fontSize: Dimens.TEXT_SIZE_BODY }}>
            {label}
        </AppText>)
);

export default React.forwardRef((props, ref) => {
    const {
        label,
        labelStyle,
        error,
        inputIcon,
        rightLabel,
        optional,
        passwordField,
        ...inputProps
    } = props;

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
            {renderIf(label,
                <AppText
                    style={styles.label}
                >
                    <AppText bold>{label}</AppText>
                    {` ${optional ? Strings('label.optional') : ''}`}
                </AppText>)}
            <View style={computeInputContainerStyle(props, focus)}>
                {renderInputIcon(inputIcon)}
                <TextInput
                    allowFontScaling={false}
                    returnKeyType="next"
                    placeholderTextColor={Colors.COLOR_NEUTRAL_3}
                    numberOfLines={1}
                    autoCapitalize="none"
                    ref={ref}
                    style={computeInputStyle(props, focus)}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    secureTextEntry={passwordField && secureTextEnable}
                    {...inputProps}
                />
                {renderIf(passwordField && focus, passwordVisibleButton())}
                {renderInputRightLabel(rightLabel)}
            </View>
            {renderIf(error, <AppText style={styles.error}>{error}</AppText>)}
        </View>
    );
});
