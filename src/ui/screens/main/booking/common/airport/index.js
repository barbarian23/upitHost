import React, { Component } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import PickerHeader from '../../../../../components/header/authHeader/PickerHeader';
import { Colors, Utils } from '../../../../../../commons';
import Strings from '../../../../../../utils/LocalizationConfig';
import { getAirport } from '../BookingAction';
import AppText from '../../../../../components/text/AppTextView';
import { normalize } from '../../../../../../commons/utils';
import styles from './styles';

class AirportPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
        };
    }

    componentDidMount() {
        this.getAirportFromProps();
        // this.getPrefilledValue();
    }

    renderHeader() {
        const { navigation } = this.props;

        return (
            <PickerHeader
                navigation={navigation}
                title={Strings('header.select_airport')}
            />
        );
    }

    renderAirports() {
        const { airports } = this.props;
        return (
            <FlatList
                keyExtractor={(item) => item.id}
                style={{ padding: normalize(16) }}
                data={airports}
                renderItem={({ item }) => {
                    const { navigation } = this.props;
                    const { airport } = Utils.getAllParamFromNavigation(navigation);
                    return this.airport(item, (airport && airport.id === item.id));
                }}
            />
        );
    }

    airport = (data, isSelected) => (
        <TouchableOpacity
            onPress={() => this.airportSelected(data, isSelected)}
            style={styles.airportContainer}
        >
            <AppText
                bold
                style={styles[`airport_title${isSelected ? '_selected' : ''}`]}
            >
                {data[`name_${Strings('language')}`]}
            </AppText>
            <AppText style={styles.airportDescription}>{data[`terminal_name_${Strings('language')}`]}</AppText>
        </TouchableOpacity>
    );

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.COLOR_NEUTRAL_7 }}>
                {this.renderHeader()}
                {this.renderAirports()}
            </View>
        );
    }

    airportSelected(airport, isSelected) {
        const { navigation } = this.props;
        navigation.goBack();

        if (!isSelected) {
            const callback = Utils.getParamFromNavigation(navigation, 'callback');
            callback(airport);
        }
    }

    getAirportFromProps() {
        const { fetchAirports, airports } = this.props;
        Utils.invokeIfDataIsEmpty(airports, fetchAirports);
    }
}

const mapStateToProps = (state) => ({
    airports: state.bookingReducer.airports.data,
});

export const mapDispatchToProps = (dispatch) => ({
    fetchAirports: () => dispatch(getAirport()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AirportPicker);
