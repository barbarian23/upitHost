import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppDialog from '../../../../../../components/dialog/AppDialog';
import AppText from '../../../../../../components/text/AppTextView';
import { Colors, Dimens, Utils } from '../../../../../../../commons';
import renderIf, { normalize } from '../../../../../../../commons/utils';
import Strings from '../../../../../../../utils/LocalizationConfig';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        borderTopRightRadius: normalize(20),
        borderTopLeftRadius: normalize(20),
        paddingHorizontal: normalize(16),
        paddingVertical: normalize(32),
    },
    title: {
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
        color: Colors.COLOR_NEUTRAL_1,
    },
    commissionInstruction: {
        paddingBottom: normalize(32),
        borderBottomColor: Colors.COLOR_NEUTRAL_3,
        borderBottomWidth: 0.5,
    },
    supplierExtraPriceInstruction: {
        paddingTop: normalize(8),
    },
});

export default function InstructionDialog(props) {
    const { onClose, visible, maxExtraPriceSalepoint } = props;

    const detailInformation = (child) => (
        <AppText style={{ marginTop: normalize(8) }}>
            {child}
        </AppText>
    );

    const commissionInstruction2Content = () => (
        <AppText style={{ marginTop: normalize(8) }}>
            {Strings('label.host_commission_instruction_3')}
            <AppText
                bold
                style={{ color: Colors.COLOR_PRIMARY_1 }}>{` ${Utils.formatVND(maxExtraPriceSalepoint)} `}
            </AppText>
        </AppText>
    );

    const commissionInstruction = () => (
        <View
            style={styles.commissionInstruction}
        >
            <AppText
                bold
                style={styles.title}
            >
                {Strings('label.my_commission')}
            </AppText>
            {detailInformation(Strings('label.host_commission_instruction_1'))}
            {renderIf(maxExtraPriceSalepoint, detailInformation(commissionInstruction2Content()))}
        </View>
    );

    const supplierExtraPriceInstruction = () => (
        <View
            style={styles.supplierExtraPriceInstruction}
        >
            <AppText
                bold
                style={styles.title}
            >
                {Strings('label.supplier_extra_price')}
            </AppText>
            {detailInformation(Strings('label.supplier_extra_price_1'))}
            {detailInformation(Strings('label.supplier_extra_price_2'))}
        </View>
    );

    return (
        <AppDialog
            dialogJustifyContent="flex-end"
            onClose={onClose}
            visible={visible}
        >
            <View style={styles.container}>
                {commissionInstruction()}
                {supplierExtraPriceInstruction()}
            </View>
        </AppDialog>
    );
}
