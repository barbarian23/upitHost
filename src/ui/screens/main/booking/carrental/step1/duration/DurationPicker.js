import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Strings from '../../../../../../../utils/LocalizationConfig';
import AirportBookingHeader from '../../../../../../components/header/authHeader/AirportBookingHeader';
import AppContainer from '../../../../../../components/container';
import AppText from '../../../../../../components/text/AppTextView';
import { normalize } from '../../../../../../../commons/utils';
import { Colors, Constants, Dimens, Styles, Utils } from '../../../../../../../commons';

export default function DurationPicker({ navigation }) {
    const { selectedDuration, callback } = Utils.getAllParamFromNavigation(navigation);
    const renderNote = () => (
        <View>
            <AppText style={{ fontSize: normalize(Dimens.TEXT_SIZE_BODY) }}>
                <AppText style={{ color: '#12A1BF' }}>
                    {`${Strings('label.note')}: `}
                </AppText>
                <AppText style={{ color: Colors.COLOR_NEUTRAL_1 }}>
                    {Strings('label.note_content')}
                </AppText>
            </AppText>
        </View>
    );

    const durationSelect = (duration) => {
        navigation.goBack();
        callback(duration);
    };

    const renderDurationList = () => (
        <View style={{ marginTop: normalize(16) }}>
            {
                Constants.DURATION.map((duration) => (
                    <TouchableOpacity
                        style={styles.durationItem(selectedDuration && selectedDuration.id === duration.id)}
                        onPress={() => {
                            durationSelect(duration);
                        }}
                    >
                        <AppText
                            style={{ color: Colors.COLOR_NEUTRAL_1, fontSize: normalize(Dimens.TEXT_SIZE_BODY) }}
                        >
                            {Strings(duration.title)}
                        </AppText>
                        <AppText
                            style={{
                                marginTop: normalize(12),
                                color: Colors.COLOR_NEUTRAL_2,
                                fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
                            }}
                        >
                            {Strings(duration.description)}
                        </AppText>
                    </TouchableOpacity>
                ))
            }
        </View>
    );

    return (
        <AppContainer
            header={(
                <AirportBookingHeader
                    navigation={navigation}
                    title={Strings('header.choose_duration')}
                />
            )}
        >
            {renderNote()}
            {renderDurationList()}
        </AppContainer>
    );
}

const styles = StyleSheet.create({
    durationItem: (selected) => ({
        paddingVertical: normalize(16),
        paddingHorizontal: normalize(12),
        marginVertical: normalize(8),
        ...Styles.cardShadowStyle,
        borderColor: selected ? Colors.COLOR_PRIMARY_1 : Colors.COLOR_NEUTRAL_4,
        borderWidth: selected ? 2 : 0.5,
        backgroundColor: selected ? Colors.COLOR_NEUTRAL_5 : Colors.COLOR_NEUTRAL_6,
    }),
});
