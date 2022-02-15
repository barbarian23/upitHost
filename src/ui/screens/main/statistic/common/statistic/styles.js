import { StyleSheet } from 'react-native';
import { normalize } from '../../../../../../commons/utils';
import { Colors, Dimens } from '../../../../../../commons';

const styles = StyleSheet.create({
    timeTitle: {
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
        color: Colors.COLOR_NEUTRAL_1,
    },
    summaryTitle: {
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
    },
    summaryValue: {
        color: Colors.COLOR_SECONDARY_2,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
    },
    listBookingTitle: {
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
        marginBottom: normalize(8),
    },
    chartTitle: {
        marginTop: normalize(8),
        height: normalize(36),
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default styles;
