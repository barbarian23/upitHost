import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import { connect } from 'react-redux';
import { Colors, Constants, Utils } from '../../../../../../commons';
import PickerHeader from '../../../../../components/header/authHeader/PickerHeader';
import Strings from '../../../../../../utils/LocalizationConfig';
import AppAutocomplete from '../../../../../components/form/AppAutoComplete';
import { requestFetchHouseList } from '../../../../../../actions/accountActions';
import renderIf, { normalize } from '../../../../../../commons/utils';
import { AnimationLoading } from '../../../../../components/loading';

class LocationPicker extends Component {
    componentDidMount() {
        this.checkAndGetHouseList();
    }

    mainView() {
        const { navigation } = this.props;
        const { airport, callback, location } = Utils.getAllParamFromNavigation(navigation);

        return (
            <View>
                <PickerHeader
                    title={Strings('header.select_location')}
                    navigation={navigation}
                />

                <AppAutocomplete
                    navigation={navigation}
                    selectedLocation={location}
                    predefinedPlaces={this.getAvailableHouseList()}
                    placeholder={Strings('label.search_other_location')}
                    minLength={2}
                    renderDescription={(row: any): any => row.description}
                    styles={{
                        predefinedPlacesDescription: {
                            color: '#1FAADB',
                        },
                    }}
                    query={this.query(airport)}
                    onPress={(data, details) => {
                        const callbackData = {
                            name: (data.isHouse) ? data.name : details.name,
                            address: (data.isHouse) ? data.description : details.formatted_address,
                            geometry: (data.isHouse) ? data.geopoint : details.geometry.location,
                            houseData: (data.isHouse) ? data.data : null,
                            airportSymbol: airport ? airport.symbol : null,
                        };

                        navigation.goBack();
                        callback(callbackData);
                    }}
                />
            </View>
        );
    }

    loadingView = () => (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <AnimationLoading
                style={{ width: normalize(80), height: normalize(80), alignSelf: 'center' }}
            />
        </View>
    );

    render() {
        const { houses, loading } = this.props;

        return houses !== null ? (
            <View style={{ flex: 1, backgroundColor: Colors.COLOR_NEUTRAL_7 }}>
                {this.mainView()}
            </View>
        ) : renderIf(loading, this.loadingView());
    }

    query = (airport) => {
        const q = {
            language: 'vi',
            key: Platform.OS === 'android' ? Constants.GOOGLE_KEY.android : Constants.GOOGLE_KEY.ios,
            types: 'geocode|establishment',
        };

        if (airport) {
            q.location = `${airport.boundary.lat},${airport.boundary.lng}`;
            q.radius = airport.boundary.radius.toString();
            q.strictbounds = true;
        } else {
            q.components = 'country:vn';
        }
        return q;
    };

    getAvailableHouseListCarRental = (houses, navigation) => {
        const { airportList } = Utils.getAllParamFromNavigation(navigation);
        let airportSet = new Set();
        airportList.forEach(({ symbol, support_carrental }) => {
            if (support_carrental && !airportSet.has(symbol)) {
                airportSet.add(symbol);
            }
        });
        return houses.filter((h) => airportSet.has(h.airport_symbol))
            .map((item) => ({
                isHouse: true,
                data: item,
                name: item.name,
                description: item.address,
                geopoint: item.geopoint,
            }));
    };

    getAvailableHouseList = () => {
        const { houses, navigation } = this.props;
        const { airport, service } = Utils.getAllParamFromNavigation(navigation);

        if (service === 'CR') {
            return this.getAvailableHouseListCarRental(houses, navigation);
        }
        return houses.filter((h) => (airport ? (h.airport_symbol === airport.symbol) : true))
            .map((item) => ({
                isHouse: true,
                data: item,
                name: item.name,
                description: item.address,
                geopoint: item.geopoint,
            }));
    };

    checkAndGetHouseList() {
        const { houses, fetchHouseList } = this.props;
        Utils.invokeIfDataIsNull(houses, fetchHouseList);
    }
}

const mapStateToProps = (state) => ({
    houses: state.accountReducer.houseList.data,
    loading: state.accountReducer.houseList.loading,
});

export const mapDispatchToProps = (dispatch) => ({
    fetchHouseList: () => dispatch(requestFetchHouseList()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LocationPicker);
