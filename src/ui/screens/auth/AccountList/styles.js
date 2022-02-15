import { StyleSheet } from 'react-native';
import { Colors, Dimens } from '../../../../commons';
import { normalize } from '../../../../commons/utils';

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.COLOR_NEUTRAL_7,
        flexDirection: 'column',
        flex: 1,
    },
    content: {
        flexDirection: 'column',
        paddingHorizontal: normalize(24),
    },
    listHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: normalize(16),
        marginTop: normalize(60),
    },
    listHeaderAccount: {
        fontSize: Dimens.TEXT_SIZE_BODY,
        color: Colors.COLOR_NEUTRAL_1,
        flex: 1,
    },
    listHeaderEdit: {
        fontSize: Dimens.TEXT_SIZE_BODY,
        color: Colors.COLOR_SECONDARY,
    },
    accountContainer: {
        paddingVertical: normalize(16),
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        flexDirection: 'row',
        marginTop: normalize(16),
        paddingStart: normalize(16),
    },
    accountNameEmailContainer: {
        flex: 1,
        justifyContent: 'center',
        marginStart: normalize(16),
        marginEnd: normalize(24),
    },
    accountName: {
        fontSize: Dimens.TEXT_SIZE_BODY,
        color: Colors.COLOR_NEUTRAL_1,
    },
    accountEmail: {
        fontSize: Dimens.TEXT_SIZE_SUB_BODY,
        color: Colors.COLOR_NEUTRAL_3,
    },
    accountRemoveContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderLeftColor: '#F9F4F3',
    },
    accountRemove: {
        marginHorizontal: normalize(12),
        width: normalize(16),
        height: normalize(16),
    },
    plusIcon: {
        width: normalize(16),
        height: normalize(16),
        marginRight: normalize(8),
    },
});

export default styles;
