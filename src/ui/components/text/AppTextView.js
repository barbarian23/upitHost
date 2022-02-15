// @flow
import React from 'react';
import { Text } from 'react-native';
import BaseView from '../view/BaseView';
import { Colors, Constants } from '../../../commons';
import PropTypes from 'prop-types';

export default class AppText extends BaseView {
    render() {
        let {
            bold,
            italic,
            style,
            children,
        } = this.props;

        let fontFamily = Constants.DEFAULT_FONT_REGULAR;
        if (bold && italic) {
            fontFamily = Constants.DEFAULT_FONT_BOLD_ITALIC;
        } else if (bold) {
            fontFamily = Constants.DEFAULT_FONT_BOLD;
        } else if (italic) {
            fontFamily = Constants.DEFAULT_FONT_ITALIC;
        }

        const textStyle = this.computeStyle({
            paddingVertical: 0,
            paddingHorizontal: 0,
            margin: 0,
            color: Colors.COLOR_BLACK,
            fontFamily,
        }, style);

        return (
            <Text {...this.props} allowFontScaling={false} style={textStyle}>
                {children}
            </Text>
        );
    }
}

AppText.defaultProps = {
    text: '',
    style: {},
};

AppText.propTypes = {
    text: PropTypes.string,
    style: PropTypes.any,
};
