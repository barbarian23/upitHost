import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import React from 'react';
import DailyContainer from '../../ui/screens/main/statistic/daily/DailyContainer';
import MonthlyContainer from '../../ui/screens/main/statistic/monthly/MonthlyContainer';
import YearlyContainer from '../../ui/screens/main/statistic/yearly/YearlyContainer';
import { Utils } from '../../commons';
import StatisticHeader from '../../ui/screens/main/statistic/common/header';

const StatisticTab = createMaterialTopTabNavigator(
    {
        Daily: {
            screen: DailyContainer,
        },
        Monthly: {
            screen: MonthlyContainer,
        },
        Yearly: {
            screen: YearlyContainer,
        },
    },
    {
        swipeEnabled: false,
        tabBarOptions: { ...Utils.topTabBarDefaultOptions(Utils.statisticTabHeader) },
    },
);

const StatisticContainer = createStackNavigator(
    {
        StatisticTab: {
            screen: StatisticTab,
            navigationOptions: (props) => ({
                header: () => (
                    <StatisticHeader />
                ),
            }),
        },
    },
    {},
);

export default StatisticContainer;
