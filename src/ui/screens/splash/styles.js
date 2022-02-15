import { StyleSheet } from 'react-native';
import { Colors } from '../../../commons';
import { normalize } from '../../../commons/utils';

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: normalize(36),
        backgroundColor: Colors.COLOR_BACKGROUND_SPLASH,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: normalize(331),
        resizeMode: 'contain',
    },
});

export default styles;
