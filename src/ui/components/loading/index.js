import React from 'react';
import { Text, View } from 'react-native';
import { Overlay } from 'react-native-elements';
import Spinner from 'react-native-spinkit';
import styles from './styles';
import { Colors } from '../../../commons';
import renderIf from '../../../commons/utils';
import LottieView from 'lottie-react-native';

export function AnimationLoading(props) {
    return (
        <LottieView
            source={require('./loading.json')}
            autoPlay
            loop
            {...props}
        />
    );
}

export default function AppLoading(props) {
    const {
        loadingIcon = 'CircleFlip',
        windowBackgroundColor = Colors.COLOR_GREY_TRANSPARENT,
        overlayBackgroundColor = Colors.COLOR_WHITE,
        text,
        textStyle,
        isVisible,
        isLoading,
    } = props;

    const defaultTextStyle = [styles.textStyle, textStyle];

    return (
        <Overlay
            isVisible={isVisible}
            windowBackgroundColor={windowBackgroundColor}
            overlayBackgroundColor={overlayBackgroundColor}
            width="auto"
            height="auto"
        >
            <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner isVisible={isLoading} type={loadingIcon} color={Colors.COLOR_PRIMARY} size={30} />
                {renderIf(text,
                    <Text style={defaultTextStyle}>
                        {text}
                    </Text>,
                )}
            </View>
        </Overlay>
    );
}

AppLoading.defaultProps = {
    loadingIcon: 'Wave',
    windowBackgroundColor: Colors.COLOR_GREY_TRANSPARENT,
    overlayBackgroundColor: Colors.COLOR_WHITE,
};
