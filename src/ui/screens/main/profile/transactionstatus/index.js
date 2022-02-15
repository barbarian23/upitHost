import React from 'react';
import { useSelector } from 'react-redux';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import AppContainer from '../../../../components/container';
import AirportBookingHeader from '../../../../components/header/authHeader/AirportBookingHeader';
import Strings from '../../../../../utils/LocalizationConfig';
import AppLoading from '../../../../components/loading';
import NoResult from '../../statistic/common/NoResult';
import { Colors, Dimens, Styles, Utils } from '../../../../../commons';
import { normalize } from '../../../../../commons/utils';
import AppText from '../../../../components/text/AppTextView';

const isPaid = (status) => {
    return status && status === 'COMPLETE';
};

export default function TransactionStatus({ navigation }) {
    const data = useSelector((state) => state.profileReducer.deptList);
    const loading = useSelector((state) => state.profileReducer.isLoadingDeptList);

    return (
        <AppContainer
            header={(
                <AirportBookingHeader
                    navigation={navigation}
                    title={Strings('header.transaction_status')}
                />
            )}
        >
            <FlatList
                data={data}
                renderItem={({ item }) => (
                    <ItemDeptHistory
                        item={item}
                        onItemPress={() => {
                            navigation.navigate('DeptDetail', { item });
                        }}
                    />
                )}
                keyExtractor={item => item.id.toString()}
                refreshing={loading}
                ListEmptyComponent={<NoResult center />}
            />
            <AppLoading
                isVisible={loading}
            />
        </AppContainer>
    );
}

function ItemDeptHistory({ onItemPress, item }) {
    const deptStatusIcon = ({ amount, status }) => {
        if (amount < 0) {
            return require('../../../../../assets/icons/ic_income.png');
        }
        if (amount === 0) {
            return require('../../../../../assets/icons/ic_wanning.png');
        }
        return require('../../../../../assets/icons/ic_outcome.png');
    };

    const deptStatusDescription = ({ amount, status }) => {
        if (amount === 0) {
            return Strings('label.not_payment');
        }
        if (isPaid(status)) {
            return Strings('label.dept_paid');
        }
        return Strings('label.dept_unpaid');
    };

    const deptTypeTitle = ({ amount }) => {
        return ((amount <= 0) ? Strings('label.system_own_amount') : Strings('label.own_system_amount'));
    };

    const date = moment(item.from_time);

    return (
        <TouchableOpacity
            onPress={onItemPress}
            style={styles.itemContainer}
        >
            <Image
                source={deptStatusIcon(item)}
                style={{ width: normalize(32), height: normalize(32), resizeMode: 'contain' }}
            />
            <View style={{ flex: 1, marginLeft: normalize(16) }}>
                <View style={{ flexDirection: 'row' }}>
                    <AppText bold style={styles.deptTypeTitle}>{deptTypeTitle(item)}</AppText>
                    <AppText bold style={styles.deptTypeValue}>{Utils.formatVND(Math.abs(item.amount))}</AppText>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <AppText style={styles.deptTimeTitle}>{Strings('label.time')}</AppText>
                    <AppText style={styles.deptTimeValue}>
                        {date.locale(Strings('language')).format('MMM, YYYY')}
                    </AppText>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <AppText style={styles.deptTimeTitle}>{Strings('label.total_earned_value')}</AppText>
                    <AppText style={styles.deptTimeValue}>
                        {Utils.formatVND(Math.abs(item.moneyKeeped))}
                    </AppText>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <AppText style={styles.paymentStatusTitle}>{Strings('label.payment_status')}</AppText>
                    <AppText style={styles.paymentStatusValue(item)}>{deptStatusDescription(item)}</AppText>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        ...Styles.cardShadowStyle,
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        padding: normalize(16),
        marginBottom: normalize(16),
        flexDirection: 'row',
        alignItems: 'center',
    },
    deptTypeTitle: { flex: 1, color: Colors.COLOR_NEUTRAL_1, fontSize: normalize(Dimens.TEXT_SIZE_BODY) },
    deptTypeValue: { color: Colors.COLOR_NEUTRAL_1, fontSize: normalize(Dimens.TEXT_SIZE_BODY) },
    deptTimeTitle: { flex: 1, color: Colors.COLOR_NEUTRAL_3, fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY) },
    deptTimeValue: { color: Colors.COLOR_NEUTRAL_3, fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY) },
    paymentStatusTitle: {
        flex: 1,
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
    },
    paymentStatusValue: ({ amount, status }) => {
        if (amount === 0) {
            return {
                color: Colors.COLOR_NEUTRAL_1,
                fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
            };
        }
        return {
            color: (isPaid(status)) ? Colors.COLOR_SEMATIC_6 : Colors.COLOR_SEMATIC_4,
            fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
        };
    },
});
