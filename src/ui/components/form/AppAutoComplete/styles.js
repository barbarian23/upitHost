import { StyleSheet } from 'react-native';
import { normalize } from '../../../../commons/utils';
import { Colors, Constants, Dimens } from '../../../../commons';

const styles = StyleSheet.create({
    container: {
        padding: normalize(16),
    },
    textInputContainer: (focus) => ({
        height: 44,
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: (focus) ? Colors.COLOR_PRIMARY_3 : Colors.COLOR_NEUTRAL_3,
        borderRadius: normalize(5),
        alignItems: 'center',
        paddingRight: normalize(10),
    }),
    textInput: {
        borderRadius: 5,
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
        flex: 1,
        fontFamily: Constants.DEFAULT_FONT,
        color: Colors.COLOR_BLACK,
        paddingHorizontal: normalize(24),
    },
    poweredContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    powered: {
        height: normalize(15),
        width: normalize(120),
    },
    listView: {
        height: '100%',
    },
    row: (isCurrentLocation) => ({
        paddingVertical: normalize(16),
        flexDirection: 'row',
        borderBottomColor: Colors.COLOR_NEUTRAL_3,
        borderBottomWidth: 0.5,
        alignItems: 'center',
        backgroundColor: isCurrentLocation ? Colors.COLOR_BACKGROUND_LIGHT : null,
    }),
    separator: {
        height: 2,
        backgroundColor: '#C8C7CC',
    },
    description: {
        flex: 1,
    },
    loader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 20,
    },
    androidLoader: {
        marginRight: -15,
    },
    managePredefinedPlace: {
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
        color: Colors.COLOR_SECONDARY,
    },
    listAddressTitle: {
        flex: 1, fontSize: normalize(Dimens.TEXT_SIZE_BODY),
    },
    listHeader: { flexDirection: 'row', alignItems: 'center', marginTop: normalize(24) },
});

export default styles;
