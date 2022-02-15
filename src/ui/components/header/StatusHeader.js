import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import renderIf, { normalize } from '../../../commons/utils';
import { Colors, Constants, Dimens, Utils } from '../../../commons';
import AppText from '../text/AppTextView';
import Strings from '../../../utils/LocalizationConfig';
import { applyFilter } from '../../screens/main/status/statusActions';

LocaleConfig.locales.vi = {
    monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    monthNamesShort: ['Th01', 'Th02.', 'Th03', 'Th04', 'Th05', 'Th06', 'Th07', 'Th08', 'Th09', 'Th10', 'Th11', 'Th12'],
    dayNames: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ 7'],
    dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    today: 'Hôm nay',
};

LocaleConfig.locales.en = {
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    today: 'Today',
};
const dots = {
    book: { key: 'BookingStatus', color: Colors.COLOR_SEMATIC_5, selectedDotColor: Colors.COLOR_SEMATIC_5 },
    assign: { key: 'AcceptStatus', color: Colors.COLOR_SEMATIC_1, selectedDotColor: Colors.COLOR_SEMATIC_1 },
    complete: { key: 'CompleteStatus', color: Colors.COLOR_SEMATIC_2, selectedDotColor: Colors.COLOR_SEMATIC_2 },
};

const dateOnly = (dateTime, status) => {
    if (dateTime === '') return dateTime;
    const dateComponents = dateTime.split(' - ')[1].split('/');
    return {
        time: `${dateComponents[2]}-${dateComponents[1]}-${dateComponents[0]}`,
        status,
    };
};

function onlyUnique(value, index, self) {
    return (self.indexOf(value) === index);
}

const groupByDate = (dateGroup, queryDate) => {
    const markedDate = {};

    Object.keys(dateGroup).forEach((date) => {
        markedDate[date] = {
            dots: dateGroup[date].map((type) => type.status).filter(onlyUnique).map((type) => dots[type]),
        };
    });

    if (!markedDate[queryDate]) {
        markedDate[queryDate] = {};
    }
    markedDate[queryDate].selected = true;
    markedDate[queryDate].selectedColor = Colors.COLOR_NEUTRAL_1;

    return markedDate;
};

const getCurrentRoute = (navigation) => {
    const { index, routeName, routes } = navigation.state;
    if (routeName === 'StatusTab') {
        return routes[index].key;
    }
    return '';
};

export default function StatusHeader({ navigation }) {
    LocaleConfig.defaultLocale = Strings('language');
    const currentRoute = getCurrentRoute(navigation);
    const dispatch = useDispatch();

    const [showCalendar, setShowCalendar] = useState(false);
    const [queryDate, setQueryDate] = useState('');

    const bookTrip = useSelector((state) => state.statusReducer.booking.data).map(({ time_leave }) => dateOnly(time_leave, 'book'));
    const assignTrip = useSelector((state) => state.statusReducer.assign.data).map(({ time_leave }) => dateOnly(time_leave, 'assign'));
    const completeTrip = useSelector((state) => state.statusReducer.complete.data)
        .map(({ time_leave }) => dateOnly(time_leave, 'complete'));

    const dateHaveTrips = [...bookTrip, ...assignTrip, ...completeTrip];
    // console.log('bookTrip', _.groupBy(dateHaveTrips, 'time'));

    // _.groupBy: [{a: b}, {a, c}, {b: c}] => {a: [{a: b}, {a, c}, b: [{b: c}]}
    const markedDate = groupByDate(_.groupBy(dateHaveTrips, 'time'), queryDate);

    const changeCalendarVisibleState = () => {
        if (showCalendar) {
            dispatch(applyFilter(''));
            setQueryDate('');
        }
        setShowCalendar(!showCalendar);
    };

    const currentDate = Utils.formatDate(new Date(), 'YYYY-MM-DD');

    function requestApplyFilter(dateString) {
        if (dateString === queryDate) {
            setQueryDate('');
            dispatch(applyFilter(''));
        } else {
            setQueryDate(dateString);
            dispatch(applyFilter(dateString));
        }

        // Navigate to proper tab screen if current tab contains no filter results
        switchTab(dateString);
    }

    function switchTab(dateString) {
        const findDate = markedDate[dateString];
        if (!findDate || !findDate.dots) {
            return;
        }

        const findRoute = findDate.dots.find((d) => d.key === currentRoute);
        if (findRoute) {
            return;
        }

        navigation.navigate(findDate.dots[0].key);
    }

    const calendarView = () => (
        <Calendar
            markingType="multi-dot"
            renderHeader={(date) => {
                return (
                    <View style={styles.calendarHeader}>
                        <AppText style={styles.headerCalendarTitle}>
                            {Utils.capitalizeFirstLetter(
                                Utils.formatDate(date['0'], 'MMMM, YYYY', Strings('language')))}
                        </AppText>
                    </View>
                );
            }}
            markedDates={markedDate}
            current={currentDate}
            onDayPress={({ dateString }) => {
                requestApplyFilter(dateString);
            }}
            onDayLongPress={({ dateString }) => {
                requestApplyFilter(dateString);
            }}

            onMonthChange={(month) => {
                console.log('month changed', month);
            }}
            theme={{
                textDayFontFamily: Constants.DEFAULT_FONT,
                textMonthFontFamily: Constants.DEFAULT_FONT,
                textDayHeaderFontFamily: Constants.DEFAULT_FONT,
            }}
            renderArrow={(direction) => {
                const src = (direction === 'left')
                    ? require('../../../assets/icons/ic_calendar_left.png')
                    : require('../../../assets/icons/ic_calendar_right.png');

                return (
                    <Image
                        source={src}
                        style={{ width: normalize(20), height: normalize(20), tintColor: Colors.COLOR_NEUTRAL_2 }}
                    />
                );
            }}
        />
    );

    return (
        <View>
            <View style={styles.container}>
                <AppText style={styles.headerTitle}>
                    {Strings('tab.trip_status')}
                </AppText>
                <TouchableOpacity
                    onPress={changeCalendarVisibleState}
                    style={{ position: 'absolute', right: normalize(16) }}
                >
                    <Image
                        style={{ width: normalize(24), height: normalize(24) }}
                        source={
                            (!showCalendar)
                                ? require('../../../assets/icons/ic_status_menu.png')
                                : require('../../../assets/icons/ic_menu.png')
                        }
                    />
                </TouchableOpacity>
            </View>
            {renderIf(showCalendar, (
                <View style={{ backgroundColor: Colors.COLOR_DARK_PINK }}>
                    {calendarView()}
                </View>
            ))}
        </View>
    );
}

export const styles = StyleSheet.create({
    container: {
        height: normalize(60),
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
    },
    calendarHeader: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCalendarTitle: { color: '#F27921', fontSize: normalize(Dimens.TEXT_SIZE_BODY) },
});
