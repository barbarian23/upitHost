import React from 'react';
import { AppState, FlatList, View } from 'react-native';
import AppContainer from '../../../../components/container';
import { Navigation, Utils } from '../../../../../commons';
import styles from './styles';
import ItemStatus from './ItemStatus';
import { normalize } from '../../../../../commons/utils';
import { AnimationLoading } from '../../../../components/loading';

export default class StatusList extends AppContainer {
    constructor(props) {
        super(props);
        this.state = {
            appState: null,
        };
    }

    static navigationOptions = ({ navigation }) => {
        // console.log("navigation::", navigation);
        let { key } = navigation.state;
        let header = Utils.statusTabHeader(key);

        return {
            title: header,
        };
    };

    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);
        this.props.onFetchData();
    }

    componentWillUnmount(): void {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange = (nextAppState) => {
        const { appState } = this.state;

        if (appState && (appState === 'inactive' || appState === 'background') && nextAppState === 'active') {
            console.log('dataRefresh::', `status::${this.props.type}`);
            this.props.onFetchData();
        }

        this.setState({
            appState: nextAppState,
        });
    };

    onPressItem = (data) => {
        this.props.navigation.navigate(Navigation.detailRouteName(data), {
            type: this.props.type,
            data,
        });
    };

    render() {
        const { isLoading } = this.props;
        if (isLoading) {
            return (
                <View style={styles.container}>
                    <AnimationLoading
                        style={{ width: normalize(80), height: normalize(80), alignSelf: 'center' }}
                    />
                </View>
            );
        }

        let { data } = this.props;

        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    style={{ padding: normalize(16) }}
                    data={data}
                    renderItem={({ item }) => (
                        <ItemStatus
                            module="status"
                            isLast={data.length - 1 !== data.indexOf(item)}
                            item={item}
                            onPressItem={this.onPressItem}
                            type={this.props.type}
                        />
                    )}
                    keyExtractor={(item) => item.id_trip.concat(item.status)}
                    refreshing={this.props.isLoading}
                    onRefresh={this.props.onFetchData}
                />
            </View>
        );
    }
}
