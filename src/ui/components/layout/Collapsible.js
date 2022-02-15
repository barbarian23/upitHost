import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import AppText from '../text/AppTextView';
import { Colors, Dimens } from '../../../commons';
import { normalize } from '../../../commons/utils';
import Strings from '../../../utils/LocalizationConfig';

export default function CollapseContainer({ title, children, ...props }) {
    const [expand, setExpand] = useState(true);

    const changeCollapsibleStatus = () => {
        setExpand(!expand);
    };

    return (
        <View {...props} >
            <View style={{ flexDirection: 'row' }}>
                <AppText style={styles.title}>{title}</AppText>
                <TouchableOpacity onPress={changeCollapsibleStatus}>
                    <AppText style={styles.changeCollapsibleStatusButton}>
                        {expand ? Strings('label.hide') : Strings('label.show')}
                    </AppText>
                </TouchableOpacity>
            </View>
            <Collapsible collapsed={!expand}>
                {children}
            </Collapsible>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        flex: 1,
        color: Colors.COLOR_NEUTRAL_1,
        fontSize: normalize(Dimens.TEXT_SIZE_SUB_BODY),
    },
    changeCollapsibleStatusButton: {
        color: Colors.COLOR_SECONDARY,
        fontSize: normalize(Dimens.TEXT_SIZE_BODY),
    },
});
