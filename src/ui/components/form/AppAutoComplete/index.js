import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Dimensions,
    FlatList,
    Image,
    Keyboard,
    Platform,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    View,
} from 'react-native';
import Qs from 'qs';
import debounce from 'lodash.debounce';
import { Icon } from 'react-native-elements';
import Spinner from 'react-native-spinkit';
import styles from './styles';
import renderIf, { normalize } from '../../../../commons/utils';
import { Colors, Dimens } from '../../../../commons';
import AppText from '../../text/AppTextView';
import Strings from '../../../../utils/LocalizationConfig';
import * as ApiBooking from '../../../../services/apis/ApiBooking';
import { AnimationLoading } from '../../loading';

const WINDOW = Dimensions.get('window');

export default class AppAutocomplete extends Component {
    _isMounted = false;

    _results = [];

    _requests = [];

    constructor(props) {
        super(props);
        this.state = this.getInitialState.call(this);
    }

    getInitialState = () => ({
        placeError: '',
        placeAvailableLoading: false,
        focus: false,
        text: this.props.getDefaultValue(),
        dataSource: this.buildRowsFromResults([]),
        listViewDisplayed: this.props.listViewDisplayed === 'auto' ? false : this.props.listViewDisplayed,
    });

    setAddressText = (address) => this.setState({ text: address });

    getAddressText = () => this.state.text;

    buildRowsFromResults = (results) => {
        let res = [];

        if (results.length === 0 || this.props.predefinedPlacesAlwaysVisible === true) {
            res = [...this.props.predefinedPlaces];

            if (this.props.currentLocation === true) {
                res.unshift({
                    description: this.props.currentLocationLabel,
                    isCurrentLocation: true,
                });
            }
        }

        res = res.map((place) => ({
            ...place,
            isPredefinedPlace: true,
        }));

        return [...res, ...results];
    };

    UNSAFE_componentWillMount() {
        this._request = this.props.debounce
            ? debounce(this._request, this.props.debounce)
            : this._request;
    }

    componentDidMount() {
        // This will load the default value's search results after the view has
        // been rendered
        this._handleChangeText(this.state.text);
        this._isMounted = true;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        let listViewDisplayed = true;

        if (nextProps.listViewDisplayed !== 'auto') {
            listViewDisplayed = nextProps.listViewDisplayed;
        }

        if (typeof (nextProps.text) !== 'undefined' && this.state.text !== nextProps.text) {
            this.setState({
                    listViewDisplayed,
                },
                this._handleChangeText(nextProps.text));
        } else {
            this.setState({
                listViewDisplayed,
            });
        }
    }

    componentWillUnmount() {
        this._abortRequests();
        this._isMounted = false;
    }

    _abortRequests = () => {
        this._requests.map((i) => i.abort());
        this._requests = [];
    };

    /**
     * This method is exposed to parent components to focus on textInput manually.
     * @public
     */
    triggerFocus = () => {
        if (this.refs.textInput) this.refs.textInput.focus();
    };

    /**
     * This method is exposed to parent components to blur textInput manually.
     * @public
     */
    triggerBlur = () => {
        if (this.refs.textInput) this.refs.textInput.blur();
    };

    getCurrentLocation = () => {
        let options = {
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 1000,
        };

        if (this.props.enableHighAccuracyLocation && Platform.OS === 'android') {
            options = {
                enableHighAccuracy: true,
                timeout: 20000,
            };
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (this.props.nearbyPlacesAPI === 'None') {
                    let currentLocation = {
                        description: this.props.currentLocationLabel,
                        geometry: {
                            location: {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            },
                        },
                    };

                    this._disableRowLoaders();
                    this.props.onPress(currentLocation, currentLocation);
                } else {
                    this._requestNearby(position.coords.latitude, position.coords.longitude);
                }
            },
            (error) => {
                this._disableRowLoaders();
                alert(error.message);
            },
            options,
        );
    };

    checkAvailablePlace = (houseData, rowData) => {
        // ApiBooking.checkPlaceAvailable()
        const { location } = rowData.geometry;
        const requestData = {
            ...location,
            service: 'CR',
        };
        this.setState({ placeAvailableLoading: true });
        setTimeout(() => {
            ApiBooking.checkPlaceAvailable(requestData)
                .then(({ data }) => {
                    this.setState({
                        placeError: '',
                    }, () => {
                        const { onPress } = this.props;
                        onPress(houseData, rowData);
                    });
                })
                .catch((error) => {
                    console.warn('available::error', error);
                    this.setState({
                        placeError: Strings('label.place_not_valid'),
                    });
                })
                .finally(() => {
                    this.setState({
                        placeAvailableLoading: false,
                    });
                });
        }, 300);
    };

    _onPress = (rowData) => {
        if (rowData.isPredefinedPlace !== true && this.props.fetchDetails === true) {
            if (rowData.isLoading === true) {
                // already requesting
                return;
            }

            Keyboard.dismiss();

            this._abortRequests();

            // display loader
            this._enableRowLoader(rowData);

            // fetch details
            const request = new XMLHttpRequest();
            this._requests.push(request);
            request.timeout = this.props.timeout;
            request.ontimeout = this.props.onTimeout;
            request.onreadystatechange = () => {
                if (request.readyState !== 4) return;

                if (request.status === 200) {
                    const responseJSON = JSON.parse(request.responseText);

                    if (responseJSON.status === 'OK') {
                        if (this._isMounted === true) {
                            const details = responseJSON.result;
                            this._disableRowLoaders();
                            this.onBlur();

                            this.setState({
                                text: this.renderDescription(rowData),
                            });

                            delete rowData.isLoading;

                            const { onPress, query } = this.props;
                            if (query.components) {
                                this.checkAvailablePlace(rowData, details);
                            } else {
                                onPress(rowData, details);
                            }
                        }
                    } else {
                        this._disableRowLoaders();

                        if (this.props.autoFillOnNotFound) {
                            this.setState({
                                text: this.renderDescription(rowData),
                            });
                            delete rowData.isLoading;
                        }

                        if (!this.props.onNotFound) {
                            console.warn(`google places autocomplete: ${responseJSON.status}`);
                        } else {
                            this.props.onNotFound(responseJSON);
                        }
                    }
                } else {
                    this._disableRowLoaders();

                    if (!this.props.onFail) {
                        console.warn(
                            'google places autocomplete: request could not be completed or has been aborted',
                        );
                    } else {
                        this.props.onFail('request could not be completed or has been aborted');
                    }
                }
            };

            request.open('GET', `https://maps.googleapis.com/maps/api/place/details/json?${Qs.stringify({
                key: this.props.query.key,
                placeid: rowData.place_id,
                language: this.props.query.language,
                ...this.props.GooglePlacesDetailsQuery,
            })}`);

            if (this.props.query.origin !== null) {
                request.setRequestHeader('Referer', this.props.query.origin);
            }

            request.send();
        } else if (rowData.isCurrentLocation === true) {
            // display loader
            this._enableRowLoader(rowData);

            this.setState({
                text: this.renderDescription(rowData),
            });

            this.triggerBlur(); // hide keyboard but not the results
            delete rowData.isLoading;
            this.getCurrentLocation();
        } else {
            this.setState({
                text: this.renderDescription(rowData),
            });

            this.onBlur();
            delete rowData.isLoading;
            let predefinedPlace = this._getPredefinedPlace(rowData);

            // sending predefinedPlace as details for predefined places
            this.props.onPress(predefinedPlace, predefinedPlace);
        }
    };

    _enableRowLoader = (rowData) => {
        let rows = this.buildRowsFromResults(this._results);
        for (let i = 0; i < rows.length; i++) {
            if ((rows[i].place_id === rowData.place_id) || (rows[i].isCurrentLocation === true && rowData.isCurrentLocation === true)) {
                rows[i].isLoading = true;
                this.setState({
                    dataSource: rows,
                });
                break;
            }
        }
    };

    _disableRowLoaders = () => {
        if (this._isMounted === true) {
            for (let i = 0; i < this._results.length; i++) {
                if (this._results[i].isLoading === true) {
                    this._results[i].isLoading = false;
                }
            }

            this.setState({
                dataSource: this.buildRowsFromResults(this._results),
            });
        }
    };

    _getPredefinedPlace = (rowData) => {
        if (rowData.isPredefinedPlace !== true) {
            return rowData;
        }

        for (let i = 0; i < this.props.predefinedPlaces.length; i++) {
            if (this.props.predefinedPlaces[i].description === rowData.description) {
                return this.props.predefinedPlaces[i];
            }
        }

        return rowData;
    };

    _filterResultsByTypes = (unfilteredResults, types) => {
        if (types.length === 0) return unfilteredResults;

        const results = [];
        for (let i = 0; i < unfilteredResults.length; i++) {
            let found = false;

            for (let j = 0; j < types.length; j++) {
                if (unfilteredResults[i].types.indexOf(types[j]) !== -1) {
                    found = true;
                    break;
                }
            }

            if (found === true) {
                results.push(unfilteredResults[i]);
            }
        }
        return results;
    };

    _requestNearby = (latitude, longitude) => {
        this._abortRequests();

        if (latitude !== undefined && longitude !== undefined && latitude !== null && longitude !== null) {
            const request = new XMLHttpRequest();
            this._requests.push(request);
            request.timeout = this.props.timeout;
            request.ontimeout = this.props.onTimeout;
            request.onreadystatechange = () => {
                if (request.readyState !== 4) {
                    return;
                }

                if (request.status === 200) {
                    const responseJSON = JSON.parse(request.responseText);

                    this._disableRowLoaders();

                    if (typeof responseJSON.results !== 'undefined') {
                        if (this._isMounted === true) {
                            let results = [];
                            if (this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding') {
                                results = this._filterResultsByTypes(responseJSON.results, this.props.filterReverseGeocodingByTypes);
                            } else {
                                results = responseJSON.results;
                            }

                            this.setState({
                                dataSource: this.buildRowsFromResults(results),
                            });
                        }
                    }
                    if (typeof responseJSON.error_message !== 'undefined') {
                        if (!this.props.onFail) console.warn(`google places autocomplete: ${responseJSON.error_message}`);
                        else {
                            this.props.onFail(responseJSON.error_message);
                        }
                    }
                } else {
                    // console.warn("google places autocomplete: request could not be completed or has been aborted");
                }
            };

            let url = '';
            if (this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding') {
                // your key must be allowed to use Google Maps Geocoding API
                url = `https://maps.googleapis.com/maps/api/geocode/json?${Qs.stringify({
                    latlng: `${latitude},${longitude}`,
                    key: this.props.query.key,
                    ...this.props.GoogleReverseGeocodingQuery,
                })}`;
            } else {
                url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${Qs.stringify({
                    location: `${latitude},${longitude}`,
                    key: this.props.query.key,
                    ...this.props.GooglePlacesSearchQuery,
                })}`;
            }

            request.open('GET', url);
            if (this.props.query.origin !== null) {
                request.setRequestHeader('Referer', this.props.query.origin);
            }

            request.send();
        } else {
            this._results = [];
            this.setState({
                dataSource: this.buildRowsFromResults([]),
            });
        }
    };

    _request = (text) => {
        this._abortRequests();
        if (text.length >= this.props.minLength) {
            const request = new XMLHttpRequest();
            this._requests.push(request);
            request.timeout = this.props.timeout;
            request.ontimeout = this.props.onTimeout;
            request.onreadystatechange = () => {
                if (request.readyState !== 4) {
                    return;
                }
                if (request.status === 200) {
                    console.log('result::', request.responseText);
                    const responseJSON = JSON.parse(request.responseText);
                    if (typeof responseJSON.predictions !== 'undefined') {
                        if (this._isMounted === true) {
                            const results = this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding'
                                ? this._filterResultsByTypes(responseJSON.predictions, this.props.filterReverseGeocodingByTypes)
                                : responseJSON.predictions;

                            this._results = results;
                            this.setState({
                                dataSource: this.buildRowsFromResults(results),
                            });
                        }
                    }
                    if (typeof responseJSON.error_message !== 'undefined') {
                        if (!this.props.onFail) console.warn(`google places autocomplete: ${responseJSON.error_message}`);
                        else {
                            this.props.onFail(responseJSON.error_message);
                        }
                    }
                } else {
                    // console.warn("google places autocomplete: request could not be completed or has been aborted");
                }
            };
            if (this.props.preProcess) {
                text = this.props.preProcess(text);
            }
            request.open('GET', `https://maps.googleapis.com/maps/api/place/autocomplete/json?&input=${encodeURIComponent(text)}&${Qs.stringify(this.props.query)}`);
            if (this.props.query.origin !== null) {
                request.setRequestHeader('Referer', this.props.query.origin);
            }

            request.send();
        } else {
            this._results = [];
            this.setState({
                dataSource: this.buildRowsFromResults([]),
            });
        }
    };

    clearText() {
        this.setState({
            text: '',
        });
    }

    _onChangeText = (text) => {
        this._request(text);

        this.setState({
            text,
            listViewDisplayed: this._isMounted || this.props.autoFocus,
            placeError: '',
        });
    };

    _handleChangeText = (text) => {
        this._onChangeText(text);

        const onChangeText = this.props
            && this.props.textInputProps
            && this.props.textInputProps.onChangeText;

        if (onChangeText) {
            onChangeText(text);
        }
    };

    getRowLoader() {
        return (
            <Spinner
                style={{ marginRight: normalize(10) }}
                isVisible
                type="Wave"
                color={Colors.COLOR_PRIMARY}
                size={20}
            />
        );
    }

    getRowIcon(rowData) {
        return (
            <Icon
                name={(rowData.isPredefinedPlace) ? 'md-home' : 'md-pin'}
                type="ionicon"
                color={Colors.COLOR_PRIMARY}
                size={20}
                containerStyle={{ marginRight: normalize(10) }}
            />
        );
    }

    renderRowData = (rowData) => {
        if (this.props.renderRow) {
            return this.props.renderRow(rowData);
        }

        if (rowData.isCurrentLocation) {
            return (rowData.data) ? this.renderCurrentLocation(rowData) : null;
        }

        if (rowData.isPredefinedPlace) {
            return this._renderPredefinedRowData(rowData);
        }

        return (
            <AppText
                style={{ fontSize: normalize(Dimens.TEXT_SIZE_BODY), color: Colors.COLOR_BLACK, flex: 1 }}
                numberOfLines={2}
            >
                {this.renderDescription(rowData)}
            </AppText>
        );
    };

    renderCurrentLocation = ({ data }) => (
        <View style={{ flex: 1 }}>
            <AppText
                bold
                style={{ fontSize: Dimens.FONT_NORMAL, color: Colors.COLOR_PRIMARY, marginTop: normalize(8) }}
                numberOfLines={2}
            >
                {data.name}
            </AppText>
            <AppText
                style={{ fontSize: Dimens.FONT_SMALL, color: Colors.COLOR_BLACK, marginTop: normalize(4) }}
                numberOfLines={3}
            >
                {data.address}
            </AppText>
        </View>
    );

    _renderPredefinedRowData = (rowData) => {
        return (
            <View style={{ flex: 1 }}>
                <AppText
                    bold
                    style={{ fontSize: normalize(Dimens.TEXT_SIZE_BODY), color: Colors.COLOR_NEUTRAL_1 }}
                    numberOfLines={2}
                >
                    {rowData.name}
                </AppText>
                <AppText
                    style={{
                        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
                        color: Colors.COLOR_NEUTRAL_3,
                        marginTop: normalize(4),
                    }}
                    numberOfLines={3}
                >
                    {rowData.description}
                </AppText>
            </View>
        );
    };

    renderDescription = (rowData) => {
        const { renderDescription } = this.props;
        if (renderDescription) {
            return renderDescription(rowData);
        }

        return rowData.description || rowData.formatted_address || rowData.name;
    };

    renderLoader = (rowData) => !rowData.isCurrentLocation ? (
        <View style={{ width: normalize(40), flexDirection: 'row-reverse' }}>
            {(rowData.isLoading) ? this.getRowLoader() : this.getRowIcon(rowData)}
        </View>
    ) : null;

    renderRow = (rowData = {}, sectionID, rowID) => {
        const { listUnderlayColor } = this.props;
        const { isCurrentLocation } = rowData;

        return !rowData.data && isCurrentLocation ? null : (
            <TouchableHighlight
                disabled={isCurrentLocation}
                onPress={() => this._onPress(rowData)}
                underlayColor={listUnderlayColor || '#C8C7CC'}
            >
                <View
                    style={styles.row(isCurrentLocation)}
                >
                    {this.renderRowData(rowData)}
                </View>
            </TouchableHighlight>
        );
    };

    onBlur = () => {
        this.triggerBlur();
        this.setState({
            focus: false,
        });
    };

    onFocus = () => this.setState({ focus: true, listViewDisplayed: true });

    renderPoweredLogo = () => {
        if (!this.shouldShowPoweredLogo()) {
            return null;
        }

        const { suppressDefaultStyles } = this.props;
        const propsStyle = this.props.styles;

        return (
            <View
                style={[suppressDefaultStyles ? {} : {
                    flexDirection: 'row',
                    marginVertical: normalize(10),
                }, styles.poweredContainer, propsStyle.poweredContainer]}
            >
                <Image
                    style={[suppressDefaultStyles ? {} : styles.powered, propsStyle.powered]}
                    resizeMode="contain"
                    source={require('../../../../assets/icons/powered_by_google_on_white.png')}
                />
            </View>
        );
    };

    shouldShowPoweredLogo = () => {
        const { enablePoweredByContainer } = this.props;
        const { dataSource } = this.state;

        if (!enablePoweredByContainer || dataSource.length === 0) {
            return false;
        }

        for (let i = 0; i < dataSource.length; i += 1) {
            let row = dataSource[i];

            if (!row.hasOwnProperty('isCurrentLocation') && !row.hasOwnProperty('isPredefinedPlace')) {
                return true;
            }
        }

        return false;
    };

    renderLeftButton = () => {
        const { renderLeftButton } = this.props;

        if (renderLeftButton) {
            return renderLeftButton();
        }
    };

    _renderRightButton = () => {
        const { text } = this.state;
        return text ? (
            <TouchableOpacity
                onPress={() => {
                    this.setState({ dataSource: this.buildRowsFromResults([]), text: '' });
                }}
            >
                <Image
                    source={require('../../../../assets/icons/ic_close.png')}
                    style={{ width: normalize(20), height: normalize(20), tintColor: Colors.COLOR_NEUTRAL_1 }}
                />
            </TouchableOpacity>
        ) : <View />;
    };

    currentSelectedLocationAvailable = (selectedLocation, text) => (
        selectedLocation && text.length === 0
    );

    renderCurrentSelectedLocation() {
        const { selectedLocation, navigation } = this.props;
        const { dataSource, text = '' } = this.state;

        return this.currentSelectedLocationAvailable(selectedLocation, text) ? (
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginTop: normalize(24) }}
            >
                <AppText
                    bold
                    style={{ fontSize: normalize(Dimens.TEXT_SIZE_BODY), color: Colors.COLOR_PRIMARY_1 }}
                    numberOfLines={2}
                >
                    {selectedLocation.name}
                </AppText>
                <AppText
                    style={{
                        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
                        color: Colors.COLOR_NEUTRAL_3,
                        marginTop: normalize(4),
                    }}
                    numberOfLines={3}
                >
                    {selectedLocation.address}
                </AppText>
            </TouchableOpacity>
        ) : <View />;
    };

    flatListHeader = () => {
        const { dataSource } = this.state;
        return (dataSource && dataSource.length > 0 && dataSource[0].isPredefinedPlace) ? (
            <View style={styles.listHeader}>
                <AppText style={styles.listAddressTitle}>{Strings('label.list_my_address')}</AppText>
                <TouchableOpacity>
                    <AppText style={styles.managePredefinedPlace}>
                        {Strings('label.manage')}
                    </AppText>
                </TouchableOpacity>
            </View>
        ) : <View />;
    };

    noPredefinedPlacesView() {
        return (
            <View style={{ alignItems: 'center' }}>
                {this.renderCurrentSelectedLocation()}
                <Image
                    source={require('../../../../assets/icons/ic_warning.png')}
                    style={{ width: normalize(96), height: normalize(96), marginTop: normalize(64) }}
                />
                <AppText
                    bold
                    style={{
                        marginTop: normalize(24),
                        textAlign: 'center',
                        fontSize: Dimens.TEXT_SIZE_BODY,
                        color: Colors.COLOR_PRIMARY_1,
                    }}
                >
                    {Strings('label.no_address_available')}
                </AppText>

                <AppText
                    style={{
                        textAlign: 'center',
                        fontSize: Dimens.TEXT_SIZE_SUB_BODY,
                        color: Colors.COLOR_NEUTRAL_3,
                    }}
                >
                    {Strings('label.no_address_available_description')}
                </AppText>
            </View>
        );
    }

    renderPlaceNotValidMessage = () => {
        const { placeError, placeAvailableLoading } = this.state;
        return (
            <View style={{ flexDirection: 'row' }}>
                {renderIf(placeAvailableLoading,
                    <AnimationLoading
                        style={{ width: normalize(30), height: normalize(30) }}
                    />)}
                {renderIf(placeError,
                    <AppText
                        style={{
                            color: Colors.COLOR_SEMATIC_4,
                            fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
                            marginTop: normalize(8),
                        }}
                        bold
                    >
                        {`* ${placeError}`}
                    </AppText>)}
            </View>
        );
    };

    _getFlatList = () => {
        const keyGenerator = () => (
            Math.random().toString(36).substr(2, 10)
        );

        if ((this.state.text !== '' || this.props.predefinedPlaces.length || this.props.currentLocation === true)) {
            return (
                <View>
                    {this.renderCurrentSelectedLocation()}
                    {this.flatListHeader()}
                    <FlatList
                        scrollEnabled={!this.props.disableScroll}
                        style={[this.props.suppressDefaultStyles ? {} : styles.listView, this.props.styles.listView]}
                        data={this.state.dataSource}
                        keyExtractor={keyGenerator}
                        extraData={[this.state.dataSource, this.props]}
                        renderItem={({ item }) => this.renderRow(item)}
                        {...this.props}
                    />
                </View>
            );
        }

        return this.noPredefinedPlacesView();
    };

    render() {
        const { focus } = this.state;
        let {
            onFocus,
            clearButtonMode,
            InputComp,
            ...userProps
        } = this.props.textInputProps;
        const TextInputComp = InputComp || TextInput;
        return (
            <View
                style={[this.props.suppressDefaultStyles ? {} : styles.container, this.props.styles.container]}
                pointerEvents="box-none"
            >
                {!this.props.textInputHide
                && (
                    <View
                        style={[this.props.suppressDefaultStyles ? {}
                            : styles.textInputContainer(focus), this.props.styles.textInputContainer]}
                    >
                        <TextInputComp
                            allowFontScaling={false}
                            ref="textInput"
                            editable={this.props.editable}
                            returnKeyType={this.props.returnKeyType}
                            keyboardAppearance={this.props.keyboardAppearance}
                            autoFocus={this.props.autoFocus}
                            style={[this.props.suppressDefaultStyles ? {} : styles.textInput, this.props.styles.textInput]}
                            value={this.state.text}
                            placeholder={this.props.placeholder}
                            onSubmitEditing={this.props.onSubmitEditing}
                            placeholderTextColor={this.props.placeholderTextColor}
                            onFocus={onFocus ? () => {
                                this.onFocus();
                                onFocus();
                            } : this.onFocus}
                            onBlur={this.onBlur}
                            underlineColorAndroid={this.props.underlineColorAndroid}
                            clearButtonMode={
                                clearButtonMode || 'while-editing'
                            }
                            {...userProps}
                            onChangeText={this._handleChangeText}
                        />
                        {this._renderRightButton()}
                    </View>
                )}
                {this.renderPlaceNotValidMessage()}
                {this._getFlatList()}
            </View>
        );
    }
}

AppAutocomplete.propTypes = {
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    underlineColorAndroid: PropTypes.string,
    returnKeyType: PropTypes.string,
    keyboardAppearance: PropTypes.oneOf(['default', 'light', 'dark']),
    onPress: PropTypes.func,
    onNotFound: PropTypes.func,
    onFail: PropTypes.func,
    minLength: PropTypes.number,
    fetchDetails: PropTypes.bool,
    autoFocus: PropTypes.bool,
    autoFillOnNotFound: PropTypes.bool,
    getDefaultValue: PropTypes.func,
    timeout: PropTypes.number,
    onTimeout: PropTypes.func,
    query: PropTypes.object,
    GoogleReverseGeocodingQuery: PropTypes.object,
    GooglePlacesSearchQuery: PropTypes.object,
    GooglePlacesDetailsQuery: PropTypes.object,
    styles: PropTypes.object,
    textInputProps: PropTypes.object,
    enablePoweredByContainer: PropTypes.bool,
    predefinedPlaces: PropTypes.array,
    currentLocation: PropTypes.bool,
    currentLocationLabel: PropTypes.string,
    nearbyPlacesAPI: PropTypes.string,
    enableHighAccuracyLocation: PropTypes.bool,
    filterReverseGeocodingByTypes: PropTypes.array,
    predefinedPlacesAlwaysVisible: PropTypes.bool,
    enableEmptySections: PropTypes.bool,
    renderDescription: PropTypes.func,
    renderRow: PropTypes.func,
    renderLeftButton: PropTypes.func,
    renderRightButton: PropTypes.func,
    listUnderlayColor: PropTypes.string,
    debounce: PropTypes.number,
    isRowScrollable: PropTypes.bool,
    text: PropTypes.string,
    textInputHide: PropTypes.bool,
    suppressDefaultStyles: PropTypes.bool,
    numberOfLines: PropTypes.number,
    onSubmitEditing: PropTypes.func,
    editable: PropTypes.bool,
    noPredefinedPlacesView: PropTypes.any,
};

AppAutocomplete.defaultProps = {
    placeholder: 'Search',
    placeholderTextColor: Colors.COLOR_LIGHT_GREY,
    isRowScrollable: false,
    underlineColorAndroid: 'transparent',
    returnKeyType: 'search',
    keyboardAppearance: 'default',
    onPress: () => {
    },
    onNotFound: () => {
    },
    onFail: () => {
    },
    minLength: 0,
    fetchDetails: true,
    autoFocus: false,
    autoFillOnNotFound: false,
    keyboardShouldPersistTaps: 'always',
    getDefaultValue: () => '',
    timeout: 20000,
    onTimeout: () => console.warn('google places autocomplete: request timeout'),
    query: {
        key: 'missing api key',
        language: 'en',
        types: 'geocode',
    },
    GoogleReverseGeocodingQuery: {},
    GooglePlacesDetailsQuery: {},
    GooglePlacesSearchQuery: {
        rankby: 'distance',
        type: 'restaurant',
    },
    styles: {},
    textInputProps: {},
    enablePoweredByContainer: true,
    predefinedPlaces: [],
    currentLocation: false,
    currentLocationLabel: 'Current location',
    nearbyPlacesAPI: 'GooglePlacesSearch',
    enableHighAccuracyLocation: true,
    filterReverseGeocodingByTypes: [],
    predefinedPlacesAlwaysVisible: false,
    enableEmptySections: true,
    listViewDisplayed: 'auto',
    debounce: 0,
    textInputHide: false,
    suppressDefaultStyles: false,
    numberOfLines: 1,
    onSubmitEditing: () => {
    },
    editable: true,
    noPredefinedPlacesView: () => {
    },
};
