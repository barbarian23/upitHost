import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppText from '../../../../components/text/AppTextView';
import { Colors, Dimens } from '../../../../../commons';
import { normalize } from '../../../../../commons/utils';
import Strings from '../../../../../utils/LocalizationConfig';

export default function StatisticHeader(props) {
    return (
        <View>
            <View style={styles.container}>
                <AppText bold style={styles.headerTitle}>
                    {Strings('header.booking_revenue')}
                </AppText>
            </View>
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
        height: normalize(40),
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.COLOR_NEUTRAL_2,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCalendarTitle: { color: '#F27921', fontSize: normalize(Dimens.TEXT_SIZE_BODY) },
});
