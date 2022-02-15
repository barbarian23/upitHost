import { PureComponent } from 'react';

export default class BaseView extends PureComponent {

    computeStyle(...args) {
        let styles = [];
        args.forEach((arg) => {
            if (Array.isArray(arg)) {
                arg.forEach((a) => {
                    styles.push(a);
                });
            } else {
                styles.push(arg);
            }
        });
        return styles;
    }

    render() {
        return null;
    }
}
