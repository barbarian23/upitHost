import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from '../../../commons';
import { normalize } from '../../../commons/utils';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width,
        height,
        backgroundColor: Colors.COLOR_NEUTRAL_7,
        padding: normalize(16),
    },
});

export default styles;
