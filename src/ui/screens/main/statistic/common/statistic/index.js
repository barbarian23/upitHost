import React, { Component } from 'react';
import { processColor, RefreshControl, ScrollView, View } from 'react-native';
import { BarChart } from 'react-native-charts-wrapper';
import { Colors, Navigation, Styles, Utils } from '../../../../../../commons';
import { AnimationLoading } from '../../../../../components/loading';
import renderIf, { normalize } from '../../../../../../commons/utils';
import { chartData, highlights, legend, visibleRange, xAxis, yAxis, zoom } from '../chartconfigs';
import AppText from '../../../../../components/text/AppTextView';
import styles from './styles';
import Strings from '../../../../../../utils/LocalizationConfig';
import * as ApiStatistic from '../../../../../../services/apis/ApiStatistic';
import ItemStatus from '../../../status/list/ItemStatus';
import NoResult from '../NoResult';

const MAX_PAGE = 20;
const PAGE_SIZE = 14;

export default class StatisticScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeQuery: null,
            completeRides: [],
            completeRidesLoading: false,
        };
    }

    componentDidMount() {
        this.getInitStatistic();
    }

    static navigationOptions = ({ navigation }) => {
        // console.log("navigation::", navigation);
        let { key } = navigation.state;
        let header = Utils.statisticTabHeader(key);

        return {
            title: header,
        };
    };

    renderLoading() {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <AnimationLoading
                    style={{ width: normalize(80), height: normalize(80), alignSelf: 'center' }}
                />
            </View>
        );
    }

    renderChart() {
        const { data, dataDescription, totalAmount, type } = this.props;
        const { loading } = this.props;
        return (
            <View style={{ height: normalize(200) }}>
                <BarChart
                    style={{ flex: 1 }}
                    data={chartData(data)}
                    xAxis={xAxis(dataDescription, type)}
                    yAxis={yAxis}
                    animation={{ durationX: 800 }}
                    legend={legend}
                    gridBackgroundColor={processColor('#FFFFFF')}
                    visibleRange={visibleRange((type))}
                    drawBarShadow={false}
                    drawValueAboveBar={false}
                    drawHighlightArrow
                    onSelect={({ nativeEvent }) => this.handleSelect(nativeEvent)}
                    highlights={highlights}
                    onChange={({ nativeEvent }) => this.handleChartChange(nativeEvent)}
                    touchEnabled
                    dragEnabled={!loading}
                    highlightPerDragEnabled={false}
                    chartDescription={{ text: '' }}
                    zoom={zoom}
                />
            </View>
        );
    }

    renderTimeTitle() {
        const { timeTitle } = this.props;
        const { timeQuery } = this.state;

        return (
            <View style={{ alignItems: 'center' }}>
                <AppText style={styles.timeTitle}>
                    {timeTitle(timeQuery)}
                </AppText>
            </View>
        );
    }

    renderSelectColumnInstruction() {
        return (
            <View style={{ alignItems: 'center' }}>
                <AppText style={styles.timeTitle}>
                    {Strings('label.select_column_instruction')}
                </AppText>
            </View>
        );
    }

    renderStatOverview() {
        const { timeQuery } = this.state;
        const { totalAmount, data } = this.props;

        const totalRideCount = (data && timeQuery && data[timeQuery]) ? data[timeQuery].y : 0;
        const totalIncome = (data && timeQuery) ? totalAmount[timeQuery] : 0;

        return (
            <View style={{ marginTop: normalize(8), flexDirection: 'row' }}>
                <View
                    style={{
                        flex: 1,
                        padding: normalize(16),
                        marginRight: normalize(16),
                        ...Styles.cardShadowStyle,
                        backgroundColor: Colors.COLOR_NEUTRAL_6,
                    }}
                >
                    <AppText style={styles.summaryTitle}>{Strings('label.total_income')}</AppText>
                    <AppText bold style={styles.summaryValue}>{Utils.formatVND(totalIncome)}</AppText>
                </View>
                <View
                    style={{
                        padding: normalize(16), ...Styles.cardShadowStyle, backgroundColor: Colors.COLOR_NEUTRAL_6,
                    }}
                >
                    <AppText style={styles.summaryTitle}>{Strings('label.total_booking')}</AppText>
                    <AppText
                        bold
                        style={styles.summaryValue}
                    >
                        {`${totalRideCount} ${Strings('label.rides')}`}
                    </AppText>
                </View>
            </View>
        );
    }

    resultView = (rides) => ((rides && rides.length > 0) ? (
        <View>
            <AppText
                style={styles.listBookingTitle}
            >
                {Strings('label.list_booking')}
            </AppText>
            {rides.map((ride) => (
                <ItemStatus
                    onPressItem={this.onPressItem}
                    item={ride}
                />
            ))}
        </View>
    ) : (
        <NoResult />
    ));

    renderListBooking() {
        const { completeRides, completeRidesLoading } = this.state;
        const rideListLoading = (
            <View style={{ height: normalize(200), justifyContent: 'center' }}>
                <AnimationLoading
                    style={{ width: normalize(80), height: normalize(80), alignSelf: 'center' }}
                />
            </View>
        );
        return (
            <View style={{ marginTop: normalize(24) }}>
                {completeRidesLoading ? rideListLoading : this.resultView(completeRides)}
            </View>
        );
    }

    renderChartTitle() {
        const { timeQuery } = this.state;
        const { loading, currentPage } = this.props;

        return (loading && currentPage > 0) ? (
            <View style={styles.chartTitle}>
                <AnimationLoading
                    style={{ width: normalize(40), height: normalize(40) }}
                />
            </View>
        ) : (
            <View style={styles.chartTitle}>
                {renderIf(!timeQuery, this.renderSelectColumnInstruction())}
                {renderIf(timeQuery, this.renderTimeTitle())}
            </View>
        );
    }

    render() {
        const { loading, currentPage } = this.props;
        const { timeQuery } = this.state;

        return (
            <View style={{ flex: 1 }}>
                {(loading && currentPage === 0) ? this.renderLoading()
                    : (
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={false}
                                    onRefresh={() => this.refreshScreen()}
                                />
                            }
                            style={{ flex: 1, backgroundColor: Colors.COLOR_NEUTRAL_7 }}
                        >
                            <View style={{ padding: normalize(16) }}>
                                {this.renderChart()}
                                {this.renderChartTitle()}
                                {renderIf(timeQuery, this.renderStatOverview())}
                                {renderIf(timeQuery, this.renderListBooking())}
                            </View>
                        </ScrollView>
                    )}
            </View>

        );
    }

    refreshScreen() {
        this.setState({
            timeQuery: null,
            completeRides: [],
            completeRidesLoading: false,
        }, () => {
            this.getInitStatistic();
        });
    }

    onPressItem = (data) => {
        const { navigation, type } = this.props;

        navigation.navigate(Navigation.detailRouteName(data), {
            type,
            data,
        });
    };

    getInitStatistic() {
        const { type, fetchStat } = this.props;
        const requestData = {
            number: 0,
            type_get: type,
        };
        fetchStat(requestData);
    }

    handleSelect({ x }) {
        const { queryStartAndEndTime } = this.props;

        this.setState({
            timeQuery: x || null,
            completeRidesLoading: !!x,
        }, () => {
            if (x) {
                const { time_begin, time_end } = queryStartAndEndTime(x);
                const data = {
                    time_begin,
                    time_end,
                    serial_before: 999999,
                };
                ApiStatistic.requestAllTripComplete(data)
                    .then(({ data }) => {
                        this.setState({
                            completeRides: data.trips,
                            completeRidesLoading: false,
                        });
                    })
                    .catch((error) => {
                        this.setState({
                            completeRidesLoading: false,
                        });
                    });
            }
        });
    }

    handleChartChange = ({ action, left }) => {
        const { currentPage, loading, type, fetchStat } = this.props;
        if (action === 'chartTranslated' && currentPage < MAX_PAGE) {
            if (left < (MAX_PAGE - currentPage - 1) * PAGE_SIZE) {
                if (!loading) {
                    const data = {
                        type_get: type,
                        number: currentPage + 1,
                    };
                    fetchStat(data);
                }
            }
        }
    };
}
