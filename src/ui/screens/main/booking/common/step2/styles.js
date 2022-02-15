import { StyleSheet } from 'react-native';
import { Colors } from '../../../../../../commons';
import { normalize } from '../../../../../../commons/utils';

const styles = StyleSheet.create({
    container: { backgroundColor: Colors.COLOR_NEUTRAL_7, flex: 1 },
    buttonContainer: {
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        paddingVertical: normalize(8),
        paddingHorizontal: normalize(16),
        borderTopWidth: 0.5,
        borderColor: Colors.COLOR_NEUTRAL_4,
    },
});

export default styles;
