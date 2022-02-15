import { StyleSheet } from 'react-native';
import { Colors } from '../../../../../commons';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.COLOR_WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContainer: {
        height: 78,
        alignContent: 'center',
        backgroundColor: Colors.COLOR_WHITE,
        flexDirection: 'row',
        marginTop: 12,
        marginHorizontal: 19,
        paddingVertical: 8,
        paddingHorizontal: 18,
    },
});

export default styles;
