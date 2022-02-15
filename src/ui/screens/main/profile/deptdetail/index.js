import { FlatList, Image, LayoutAnimation, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import AppContainer from '../../../../components/container';
import Strings from '../../../../../utils/LocalizationConfig';
import AirportBookingHeader from '../../../../components/header/authHeader/AirportBookingHeader';
import { Colors, Constants, Dimens, Styles, Utils } from '../../../../../commons';
import ApiHelper from '../../../../../services/apis/ApiHelper';
import NoResult from '../../statistic/common/NoResult';
import { normalize } from '../../../../../commons/utils';
import AppText from '../../../../components/text/AppTextView';
import AppLoading from '../../../../components/loading';

const requestCompleteRideRequestBody = (from, end) => ({
    time_begin: `${from.format(Constants.EDIT_DATE_FORMAT)} 00:00`,
    time_end: end.format(Constants.SERVER_REVERSE_TIME_DATE_FORMAT),
    serial_before: 99999,
});

export default function DeptDetail({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    function initData() {
        const item = Utils.getParamFromNavigation(navigation, 'item');

        const fromTime = item ? moment(item.from_time) : moment().startOf('month');
        const endTime = item ? moment(item.to_time) : moment();

        setLoading(true);
        setTimeout(() => {
            ApiHelper.post(Constants.GET_ALL_TRIP_COMPLETE_PATH, requestCompleteRideRequestBody(fromTime, endTime))
                .then(({ data }) => {
                    setLoading(false);
                    setTimeout(() => {
                        const { trips } = data;
                        setData(trips.map((t) => {
                            t.expand = false;
                            return t;
                        }));
                    }, 400);
                })
                .catch((error) => {
                    setLoading(false);
                    setTimeout(() => {
                        Utils.showToast(error.toString());
                    }, 400);
                });
        }, 400);
    }

    useEffect(() => {
        (async () => {
            initData();
        })();
    }, []);

    return (
        <AppContainer
            header={(
                <AirportBookingHeader
                    navigation={navigation}
                    title={Strings('header.dept_detail')}
                />
            )}
        >
            <FlatList
                onRefresh={() => {
                    initData();
                }}
                showsVerticalScrollIndicator={false}
                refreshing={loading}
                data={data}
                renderItem={({ item }) => (<RideItem item={item} />)}
                keyExtractor={(item) => item.id_trip.toString()}
                ListEmptyComponent={<NoResult center />}
            />
            <AppLoading
                isVisible={loading}
            />
        </AppContainer>
    );
}

function RideItem({ item }) {
    const renderDetailItem = (title, detail) => (
        <View style={{ flexDirection: 'row', marginBottom: normalize(4) }}>
            <AppText style={{ color: Colors.COLOR_BLACK, fontSize: Dimens.FONT_SMALL }}>
                {title.concat(': ')}
            </AppText>
            <AppText style={{ color: Colors.COLOR_BLACK, flex: 1, textAlign: 'right' }}>
                {detail}
            </AppText>
        </View>
    );

    const [expand, setExpand] = useState(false);

    let serverTime = item.time_leave;
    let displayTime = moment(serverTime, 'HH:mm - DD/MM/YYYY').format('DD/MM/YYYY HH:mm');

    let amount = (item.payment_method === 'debt') ? (item.price - item.price_salepoint) : item.price_salepoint;
    amount = (item.payment_method === 'debt') ? 0 - amount : amount;

    return (
        <TouchableOpacity
            onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setExpand(!expand);
            }}
            style={styles.itemContainer}
        >
            <View style={{ paddingHorizontal: normalize(16), paddingTop: normalize(16), paddingBottom: normalize(12) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={Utils.getPaymentMethodIcon(item.payment_method)}
                        style={{
                            width: normalize(32),
                            height: normalize(32),
                            resizeMode: 'contain',
                        }}
                    />
                    <View style={{ flex: 1, marginLeft: normalize(16) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <AppText style={styles.displayTime} bold>
                                {displayTime}
                            </AppText>

                            <AppText style={styles.serial} bold>
                                {Utils.displaySerial(item)}
                            </AppText>
                        </View>

                        <View style={{ marginTop: normalize(4), alignItems: 'center', flexDirection: 'row' }}>
                            <AppText style={styles.customerName}>
                                {item.name_customer}
                            </AppText>

                            <AppText style={styles.amountEarned(amount)}>
                                {((amount > 0) ? '+' : '').concat(Utils.formatVND(amount))}
                            </AppText>
                        </View>
                    </View>
                </View>
                {expand
                && (
                    <View style={styles.expandContainer}>
                        {renderDetailItem(Strings('label.passenger_name'), item.name_customer)}
                        {renderDetailItem(Strings('label.payment_method'), Utils.getPaymentMethod(item.payment_method))}
                        {renderDetailItem(Strings('label.system_price'), Utils.formatVND(item.system_price))}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: Colors.COLOR_WHITE,
        ...Styles.cardShadowStyle,
        marginBottom: normalize(16),
    },
    expandContainer: {
        marginTop: normalize(8),
        paddingTop: normalize(8),
        borderTopWidth: 1,
        borderTopColor: Colors.COLOR_LIGHT_GREY,
    },
    amountEarned: (amount) => ({
        textAlign: 'right',
        flex: 1,
        color: (amount < 0) ? Colors.COLOR_SEMATIC_4 : Colors.COLOR_SEMATIC_3,
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
    }),
    customerName: { color: Colors.COLOR_NEUTRAL_2, fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY) },
    serial: {
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
        textAlign: 'right',
    },
    displayTime: {
        flex: 1,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
        color: Colors.COLOR_NEUTRAL_1,
    },
});
