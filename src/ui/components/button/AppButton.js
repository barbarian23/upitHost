import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import styles from './styles';
import AppText from '../text/AppTextView';

const computeContainerStyle = (props, disabled) => {
    const { containerStyle, outline } = props;
    let defaultContainerStyle = [
        styles.container,
    ];
    defaultContainerStyle = [...defaultContainerStyle, (outline) ? styles.containerOutline : styles.containerPrimary];
    defaultContainerStyle = [...defaultContainerStyle, containerStyle];

    if (disabled) {
        defaultContainerStyle = [...defaultContainerStyle, styles.disabled];
    }
    return defaultContainerStyle;
};

const computeTextStyle = (props) => {
    const { textStyle, outline } = props;
    let defaultTextStyle = [
        styles.text,
    ];

    defaultTextStyle = [...defaultTextStyle, (outline) ? styles.textButtonOutline : styles.textButtonPrimary];
    defaultTextStyle = [...defaultTextStyle, textStyle];
    return defaultTextStyle;
};

export default function AppButton(props) {
    const { onPress, text, textIcon, disabled } = props;

    return (
        <TouchableOpacity
            disabled={disabled}
            style={computeContainerStyle(props, disabled)}
            onPress={onPress}
        >
            <View style={styles.textContainer}>
                {textIcon || <View />}
                <AppText style={computeTextStyle(props)}>
                    {text}
                </AppText>
            </View>
        </TouchableOpacity>
    );
}
