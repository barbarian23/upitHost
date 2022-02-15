import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-spinkit';
import AppText from '../text/AppTextView';
import { Colors, Dimens } from '../../../commons';
import renderIf, { normalize } from '../../../commons/utils';
import Strings from '../../../utils/LocalizationConfig';

/* eslint-disable no-use-before-define */

export const computeContainerStyle = (props) => {
    const { containerStyle } = props;
    let defaultContainerStyle = [
        styles.container,
    ];
    defaultContainerStyle = [...defaultContainerStyle, containerStyle];
    return defaultContainerStyle;
};

export const renderRightButton = (onPress, disabled, value) => {
    return !disabled ? (
        <TouchableOpacity onPress={onPress}>
            <AppText
                style={styles.rightButton(disabled)}
            >
                {value ? Strings('label.change') : Strings('label.choose')}
            </AppText>
        </TouchableOpacity>
    ) : (
        <Spinner
            size={15}
            type="Wave"
            color={Colors.COLOR_SECONDARY}
            isVisible
        />
    );
};

export default function AppPressInput(props) {
    const { title, value, icon, rightButton, onPress, placeholder, error, disabled, loading } = props;
    return (
        <View style={computeContainerStyle(props)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AppText style={styles.title} bold>{title}</AppText>
                <Spinner
                    size={15}
                    type="Wave"
                    color={Colors.COLOR_PRIMARY_1}
                    isVisible={!!loading}
                />
            </View>
            <TouchableOpacity
                onPress={onPress}
                style={styles.contentContainer}
                disabled={rightButton}
            >
                <Image
                    style={styles.icon}
                    source={icon}
                />
                <AppText
                    style={styles.content(value)}
                    numberOfLines={1}
                >
                    {value || placeholder}
                </AppText>
                {renderIf(rightButton, renderRightButton(onPress, disabled, value))}

            </TouchableOpacity>
            {error && <AppText style={styles.error}>Error</AppText>}
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
        flex: 1,
    },
    icon: {
        width: normalize(20),
        height: normalize(20),
        resizeMode: 'contain',
    },
    contentContainer: {
        paddingBottom: normalize(8),
        alignItems: 'center',
        marginTop: normalize(8),
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.COLOR_NEUTRAL_3,
    },
    content: (value) => ({
        color: value ? Colors.COLOR_NEUTRAL_1 : Colors.COLOR_NEUTRAL_3,
        flex: 1,
        marginStart: normalize(8),
        marginEnd: normalize(16),
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
    }),
    rightButton: (disabled) => ({
        color: disabled ? Colors.COLOR_NEUTRAL_3 : Colors.COLOR_SECONDARY,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
    }),
    error: {
        marginTop: normalize(8),
        marginStart: normalize(28),
        color: Colors.COLOR_SEMATIC,
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
    },
    container: {
        flexDirection: 'column',
    },
});
