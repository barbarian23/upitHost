import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppDialog from '../../../../../components/dialog/AppDialog';
import { Colors, Dimens, Utils } from '../../../../../../commons';
import AppText from '../../../../../components/text/AppTextView';
import Strings from '../../../../../../utils/LocalizationConfig';
import { normalize } from '../../../../../../commons/utils';

export default function PriceInformationDialog({ onClose }) {
    const informationItem = (info) => (
        <View style={{ marginTop: normalize(8), flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.dot} />
            <AppText style={{ fontSize: normalize(Dimens.TEXT_SIZE_BODY), color: Colors.COLOR_NEUTRAL_1 }}>
                {info}
            </AppText>
        </View>
    );

    const overtimePrice = (type, price) => (
        <View style={{ marginTop: normalize(8), flexDirection: 'row', alignItems: 'center' }}>
            <AppText style={{ marginLeft: normalize(30), fontSize: normalize(Dimens.TEXT_SIZE_BODY) }}>
                <AppText style={{ color: Colors.COLOR_NEUTRAL_1 }}>{`${type}: `}</AppText>
                <AppText style={{ color: Colors.COLOR_PRIMARY_1 }}>{`${price}/${Strings('label.hour')}`}</AppText>
            </AppText>
        </View>
    );

    return (
        <AppDialog
            dialogJustifyContent="flex-end"
            onClose={onClose}
            visible
            backgroundColor={Colors.COLOR_GREY_TRANSPARENT}
            onBackdropPress={onClose}
        >
            <View style={styles.container}>
                <AppText bold style={styles.title}>{Strings('label.information')}</AppText>
                {informationItem(Strings('label.price_information_1'))}
                {informationItem(Strings('label.price_information_2'))}
                {informationItem(Strings('label.price_information_3'))}
                {overtimePrice('SEDAN', Utils.formatVND(80000))}
                {overtimePrice('SUV', Utils.formatVND(100000))}
                {overtimePrice('MINIVAN', Utils.formatVND(120000))}
            </View>
        </AppDialog>
    );
}

const styles = StyleSheet.create({
    dot: {
        width: normalize(8),
        height: normalize(8),
        backgroundColor: Colors.COLOR_SECONDARY_2,
        borderRadius: normalize(8),
        marginRight: normalize(8),
    },
    container: {
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        borderTopEndRadius: normalize(20),
        borderTopStartRadius: normalize(20),
        paddingHorizontal: normalize(16),
        paddingTop: normalize(16),
        paddingBottom: normalize(16),
        width: '100%',
    },
    title: {
        marginTop: normalize(16),
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
        color: Colors.COLOR_NEUTRAL_1,
    },
    successMessage: {
        marginTop: normalize(8),
        textAlign: 'center',
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
        color: Colors.COLOR_NEUTRAL_2,
    },
    successConfirmButton: {
        flex: 1,
    },
    successGoToStatus: {
        color: Colors.COLOR_PRIMARY_1,
        fontSize: normalize(Dimens.TEXT_SIZE_BUTTON),
    },
    cancelButtonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    message: {
        textAlign: 'center',
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
        marginTop: normalize(8),
    },
});
