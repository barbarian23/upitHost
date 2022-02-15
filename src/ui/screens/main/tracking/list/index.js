import React from 'react';
import { FlatList, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AirportBookingHeader from '../../../../components/header/authHeader/AirportBookingHeader';
import Strings from '../../../../../utils/LocalizationConfig';
import RideSummaryInformation from '../common/RideSummaryInformation';
import { normalize } from '../../../../../commons/utils';
import { Utils } from '../../../../../commons';
import { fetchRiding } from '../trackingAction';

export default function ActiveRideList(props) {
    const activeRides = useSelector(state => state.trackingReducer.riding.data);
    const refreshLoading = useSelector(state => state.trackingReducer.riding.loading);

    const dispatch = useDispatch();

    const { navigation } = props;
    const { selectRideCallback, selectedRide } = Utils.getAllParamFromNavigation(navigation);

    const header = () => (
        <AirportBookingHeader
            navigation={navigation}
            title={Strings('label.select_a_trip')}
        />
    );

    const renderItem = (data) => (
        <View style={{ paddingBottom: normalize(16) }}>
            <RideSummaryInformation
                selected={selectedRide && selectedRide.id_trip === data.id_trip}
                ride={data}
                onPress={() => {
                    navigation.goBack();
                    selectRideCallback(data);
                }}
            />
        </View>
    );

    const list = () => (
        <FlatList
            data={activeRides}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(data) => data.id_trip}
            onRefresh={() => dispatch(fetchRiding())}
            showsVerticalScrollIndicator={false}
            refreshing={refreshLoading}
        />
    );

    return (
        <View style={{ flexDirection: 'column', flex: 1 }}>
            {header()}
            <View
                style={{ padding: normalize(16), flex: 1 }}
            >
                {list()}
            </View>
        </View>
    );
}
