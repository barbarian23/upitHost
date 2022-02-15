import React from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';

function AppDialog(props) {

    const {
        visible, onClose, hasKeyboardInput, disableSwipeDown, children,
        backgroundColor, dialogJustifyContent, onBackdropPress
    } = props;

    let content = (
        <View style={{}}>
            {children}
        </View>
    );

    let swipeDirection = (disableSwipeDown) ? [] : ['down'];
    return (
        <Modal
            isVisible={visible}
            onSwipeComplete={onClose}
            swipeDirection={swipeDirection}
            onBackdropPress={onBackdropPress || onClose}
            style={{
                justifyContent: dialogJustifyContent || 'center',
                margin: 0,
                backgroundColor,
            }}
        >
            {hasKeyboardInput
                ? (
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'android' ? undefined : 'position'}
                        enabled
                    >
                        {content}
                    </KeyboardAvoidingView>
                )
                : content}
        </Modal>
    );
}

AppDialog.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    hasKeyboardInput: PropTypes.bool,
};

AppDialog.defaultProps = {
    hasKeyboardInput: false,
};

export default AppDialog;
