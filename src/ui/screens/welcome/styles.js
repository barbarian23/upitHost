import { StyleSheet } from 'react-native';
import { Colors, Dimens } from '../../../commons';
import { normalize } from '../../../commons/utils';

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.COLOR_NEUTRAL_7,
        flex: 1,
        flexDirection: 'column',
    },
    image: {
        alignSelf: 'center',
        paddingHorizontal: normalize(36),
        marginTop: normalize(80),
        resizeMode: 'contain',
        flex: 3,
    },
    buttonGroupContainer: {
        marginBottom: normalize(60),
        flexDirection: 'column',
        marginHorizontal: normalize(24),
    },
    welcomeContainer: {
        marginTop: normalize(20),
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    skipContainer: {
        paddingVertical: normalize(12),
        marginTop: normalize(16),
        alignItems: 'center',
        justifyContent: 'center',
    },
    skip: {
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: Dimens.TEXT_SIZE_BUTTON,
    },
    welcomeTitle: {
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: Dimens.TEXT_SIZE_HEADING,
    },
    welcomeDescription: {
        color: Colors.COLOR_NEUTRAL_3,
        fontSize: Dimens.TEXT_SIZE_BODY,
    },
    content: {
        flex: 4,
        flexDirection: 'column',
    },
});

export default styles;
