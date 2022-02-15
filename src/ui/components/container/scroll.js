import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import styles from './styles';

export default class AppScrollViewContainer extends Component {
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
                <ScrollView {...this.props} style={this.computeStyle(styles.container, style)}>
                    {children}
                </ScrollView>
            </View>
        );
    }
}

AppScrollViewContainer.defaultProps = {
    style: {},
    header: (<View />),
};
