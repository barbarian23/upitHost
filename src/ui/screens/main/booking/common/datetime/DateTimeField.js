import React, { useState } from 'react';
import { View } from 'react-native';
import moment from 'moment';
import AppPressInput from '../../../../../components/form/AppPressInput';
import { normalize } from '../../../../../../commons/utils';
import AppText from '../../../../../components/text/AppTextView';
import { Colors, Dimens } from '../../../../../../commons';
import TimePicker from '../../../../../components/picker/TimePicker';
import DatePicker from '../../../../../components/picker/DatePicker';
import Strings from '../../../../../../utils/LocalizationConfig';

export const DEFAULT_TIME = '--:--';

export default function DateTimeField(props: any): any {
    const { containerStyle } = props;
    const { date, time } = props;
    const { dateSelected, timeSelected } = props;
    const { loading } = props;

    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [timePickerVisible, setTimePickerVisible] = useState(false);

    let dateString = moment(date).locale(Strings('language')).format('ddd, DD MMM YYYY');
    let timeString = (time) ? moment(time).locale(Strings('language')).format('HH:mm A') : '';

    const { error } = props;
    const { title } = props;

    const { innerRef } = props;

    return (
        <View>
            <View
                ref={innerRef}
                style={[containerStyle, {
                    flexDirection: 'row',
                }]}
            >
                <AppPressInput
                    containerStyle={{ flex: 1.75 }}
                    title={Strings('label.pick_up_date')}
                    icon={require('../../../../../../assets/icons/ic_calendar_booking.png')}
                    placeholder=""
                    value={dateString}
                    onPress={() => setDatePickerVisible(true)}
                />

                <AppPressInput
                    containerStyle={{ flex: 1, marginLeft: normalize(24) }}
                    title={Strings('label.time')}
                    icon={require('../../../../../../assets/icons/ic_bxs_time.png')}
                    placeholder={DEFAULT_TIME}
                    value={timeString}
                    onPress={() => setTimePickerVisible(true)}
                    loading={loading}
                />

                <TimePicker
                    isVisible={timePickerVisible}
                    time={time || new Date()}
                    onConfirm={async (selected: any) => {
                        setTimePickerVisible(false);
                        setTimeout(() => {
                            timeSelected(selected);
                        }, 300);
                    }}
                    onCancel={() => {
                        setTimePickerVisible(false);
                    }}
                />

                <DatePicker
                    isVisible={datePickerVisible}
                    date={date || new Date()}
                    onConfirm={async (confirmDate: any) => {
                        setDatePickerVisible(false);
                        setTimeout(() => {
                            dateSelected(confirmDate);
                        }, 300);
                    }}
                    onCancel={() => {
                        setDatePickerVisible(false);
                    }}
                />
            </View>
            <AppText
                bold
                style={{
                    marginTop: normalize(4),
                    alignSelf: 'flex-end',
                    color: Colors.COLOR_RED,
                    fontSize: Dimens.FONT_TINY,
                }}
            >
                {error}
            </AppText>
        </View>
    );
}
