import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { Utils } from '../../commons';
import Booking from '../../ui/screens/main/status/booking';
import Assign from '../../ui/screens/main/status/assign';
import Complete from '../../ui/screens/main/status/complete';
import StatusHeader from '../../ui/components/header/StatusHeader';

const StatusTab = createMaterialTopTabNavigator(
    {
        BookingStatus: {
            screen: Booking,
        },
        AcceptStatus: {
            screen: Assign,
        },
        CompleteStatus: {
            screen: Complete,
        },
    },
    {
        tabBarOptions: Utils.topTabBarDefaultOptions(Utils.statusTabHeader),
    },
);

const StatusContainer = createStackNavigator(
    {
        StatusTab: {
            screen: StatusTab,
            navigationOptions: ({ navigation }) => ({
                header: () => (
                    <StatusHeader
                        navigation={navigation}
                    />
                ),
            }),
        },
    },
    {
        initialRouteName: 'StatusTab',
        headerMode: 'screen',
    },
);

export default StatusContainer;
