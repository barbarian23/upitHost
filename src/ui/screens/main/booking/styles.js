import { StyleSheet } from 'react-native';
import { Colors, Dimens, Styles } from '../../../../commons';
import { normalize } from '../../../../commons/utils';

const styles = StyleSheet.create({
    helloTitle: {
        fontSize: Dimens.TEXT_SIZE_HEADING,
        color: Colors.COLOR_NEUTRAL_2,
    },
    helloMessage: {
        marginTop: normalize(4),
        color: Colors.COLOR_NEUTRAL_2,
        fontSize: Dimens.TEXT_SIZE_BODY,
    },
    container: {
        padding: normalize(16),
    },
    scrollView: {
        backgroundColor: Colors.COLOR_NEUTRAL_7,
        flex: 1,
    },
    bookingOptionContainer: {
        marginTop: normalize(32),
    },
    option: {
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        padding: normalize(16),
        flexDirection: 'row',
        marginBottom: normalize(16),
        alignItems: 'center',
        ...Styles.cardShadowStyle,
    },
    optionImageContainer: (backgroundColor) => ({
        width: normalize(64),
        height: normalize(64),
        backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
    }),
    optionTitle: {
        marginLeft: normalize(24),
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: Dimens.TEXT_SIZE_BODY,
    },
    optionImage: (tintColor) => ({
        width: normalize(32),
        height: normalize(32),
        resizeMode: 'contain',
        tintColor,
    }),
});

export default styles;
