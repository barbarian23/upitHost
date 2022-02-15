import { StyleSheet } from 'react-native';
import { normalize } from '../../../../../../commons/utils';
import { Colors, Dimens } from '../../../../../../commons';

const styles = StyleSheet.create({
    airport_title: {
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
        color: Colors.COLOR_NEUTRAL_1,
    },
    airport_title_selected: {
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
        color: Colors.COLOR_PRIMARY_1,
    },
    airportDescription: {
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
        color: Colors.COLOR_NEUTRAL_3,
    },
    airportContainer: {
        paddingVertical: normalize(16),
        borderBottomWidth: 1,
        borderBottomColor: Colors.COLOR_NEUTRAL_3,
    },
});

export default styles;
