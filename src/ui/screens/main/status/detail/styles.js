import { StyleSheet } from 'react-native';
import { Colors, Dimens, Styles } from '../../../../../commons';
import { normalize } from '../../../../../commons/utils';

const styles = StyleSheet.create({
    tripStatus: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: normalize(16),
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        ...Styles.cardShadowStyle,
        marginBottom: normalize(8),
    },
    statusStepImage: {
        width: normalize(24),
        height: normalize(24),
        resizeMode: 'contain',
    },
    statusStepImageReached: {
        tintColor: Colors.COLOR_PRIMARY_1,
    },
    statusStepImageUnreached: {
        tintColor: Colors.COLOR_NEUTRAL_3,
    },
    statusStepTitle: {
        marginTop: normalize(8),
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
    },
    statusStepTitleReached: {
        color: Colors.COLOR_NEUTRAL_1,
    },
    statusStepTitleUnreached: {
        color: Colors.COLOR_NEUTRAL_3,
    },
    card: {
        ...Styles.cardShadowStyle,
        backgroundColor: Colors.COLOR_WHITE,
        paddingVertical: normalize(8),
        paddingHorizontal: normalize(16),
    },
    informationViewImage: {
        width: normalize(20),
        height: normalize(20),
        resizeMode: 'contain',
        tintColor: Colors.COLOR_PRIMARY_1,
    },
    informationViewText: {
        color: Colors.COLOR_SECONDARY,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
    },
    priceItemContainer: {
        paddingVertical: normalize(16),
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.COLOR_NEUTRAL_3,
    },
    priceItemContainerTotal: {
        borderBottomWidth: 0,
        borderTopWidth: 1,
        borderTopColor: Colors.COLOR_NEUTRAL_1,
    },
    priceLabel: {
        flex: 1,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
        color: Colors.COLOR_NEUTRAL_1,
    },
    priceValue: {
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
        color: Colors.COLOR_NEUTRAL_1,
    },
    buttonContainer: {
        flexDirection: 'row',
        paddingVertical: normalize(8),
        paddingHorizontal: normalize(16),
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        ...Styles.cardShadowStyle,
        alignItems: 'center',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
});

export default styles;
