import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { normalize } from '../../../../../commons/utils';
import { Colors, Constants, Dimens, Styles, Utils } from '../../../../../commons';
import Strings from '../../../../../utils/LocalizationConfig';
import AppText from '../../../../components/text/AppTextView';

export default function ItemStatus(props) {

    const onPress = () => {
        const { item, onPressItem } = props;
        onPressItem(item);
    };

    /**
     * modules: (statistic | status) : screen in which this item is shown
     */
    const { item, isLast, containerStyle, module } = props;
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.itemContainer, containerStyle]}
        >
            <View
                style={{ alignItems: 'center', justifyContent: 'center', padding: Dimens.PADDING_CONTENT * 2 }}
            >
                <View
                    style={styles.imageContainer}
                >
                    <Image
                        style={{
                            tintColor: Utils.iconTintColor(item.trip_type),
                            width: normalize(40),
                            resizeMode: 'contain',
                        }}
                        source={Utils.vehicleIcon(item.vehicle_type, item.trip_type)}
                    />
                </View>
            </View>

            <View style={{
                alignItems: 'center',
                flexDirection: 'row',
                flex: 1,
                paddingTop: Dimens.PADDING_LAYOUT * 1.5,
                paddingBottom: Dimens.PADDING_LAYOUT * 1.5,
                paddingRight: Dimens.PADDING_CONTENT,
            }}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <AppText
                        numberOfLines={1}
                        style={{
                            fontSize: normalize(Dimens.TEXT_SIZE_BODY),
                            fontFamily: Constants.DEFAULT_FONT_REGULAR,
                            color: Colors.COLOR_LIGHT_BLUE,
                        }}
                    >
                        {`#${Utils.displaySerial(item)} `}
                        <AppText
                            numberOfLines={1}
                            textStyle={{
                                fontSize: normalize(Dimens.FONT_SMALL),
                                color: Colors.COLOR_BLACK,
                            }}
                        >
                            {`- ${item.name_customer}`}
                        </AppText>
                    </AppText>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: normalize(8) }}>
                        <Image
                            style={styles.timeIcon}
                            source={require('../../../../../assets/icons/ic_bxs_time.png')}
                        />
                        <AppText style={styles.timeText}>
                            {`${item.time_leave}`}
                        </AppText>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        width: normalize(56),
        height: normalize(56),
        borderRadius: normalize(4),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.COLOR_NEUTRAL_5,
    },
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    itemContainer: {
        marginVertical: normalize(8),
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        alignContent: 'center',
        flexDirection: 'row',
        ...Styles.cardShadowStyle,
    },
    textContainer: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.COLOR_DISABLE,
    },
    subtitleText: {
        fontSize: Dimens.FONT_TINY,
        color: Colors.COLOR_GREY,
        marginTop: normalize(5),
        fontFamily: Constants.DEFAULT_FONT_REGULAR,
    },
    timeIcon: { width: normalize(16), height: normalize(16), tintColor: Colors.COLOR_NEUTRAL_3 },
    timeText: {
        color: Colors.COLOR_NEUTRAL_2,
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
        marginLeft: normalize(8),
    },
});
