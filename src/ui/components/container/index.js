import React, { Component } from 'react';
import { View } from 'react-native';
import styles from './styles';

export default class AppContainer extends Component {
    computeStyle(...args) {
        let s = [];
        for (let i = 0; i < args.length; i += 1) {
            let arg = args[i];
            if (Array.isArray(arg)) {
                arg.forEach((child) => {
                    s.push(child);
                });
            } else {
                s.push(arg);
            }
        }
        return s;
    }

    render() {
        const { children, style, header } = this.props;
        return (
            <View style={{ flex: 1 }}>
                {header}
                <View {...this.props} style={this.computeStyle(styles.container, style)}>
                    {children}
                </View>
            </View>
        );
    }
}

AppContainer.defaultProps = {
    style: {},
    header: () => (<View />),
};
