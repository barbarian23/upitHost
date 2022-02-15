import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import AppContainer from '../../../../components/container';
import AirportBookingHeader from '../../../../components/header/authHeader/AirportBookingHeader';
import Strings from '../../../../../utils/LocalizationConfig';
import { Colors, Constants, Storage, Styles, Utils } from '../../../../../commons';
import { normalize } from '../../../../../commons/utils';
import AppButton from '../../../../components/button/AppButton';
import { Controller, useForm } from 'react-hook-form';
import BookingInput from '../../../../components/form/BookingInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ApiHelper from '../../../../../services/apis/ApiHelper';
import AppLoading from '../../../../components/loading';

export default function ChangePassword({ navigation }) {
    const { control, clearErrors, errors, watch, handleSubmit } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            old: '',
            newPass: '',
            confirm: '',
        },
    });

    const oldRef = useRef();
    const newRef = useRef();
    const confirmRef = useRef();

    const formError = Utils.getFormError(errors);

    const passwordField = (name, ref, label, nextRef) => (
        <Controller
            name={name}
            control={control}
            render={({ value, onChange }) => {
                const error = (formError[0] === '' || formError[0] !== name) ? null : formError[1];
                return (
                    <BookingInput
                        containerStyle={{ marginBottom: normalize(8), marginTop: normalize(16) }}
                        inputIcon={require('../../../../../assets/icons/ic_lock.png')}
                        ref={ref}
                        label={label}
                        value={value}
                        onChangeText={(text) => {
                            onChange(text);
                            clearErrors();
                        }}
                        error={error}
                        onSubmitEditing={() => {
                            ref.current.blur();
                            if (nextRef) {
                                nextRef.current.focus();
                            }
                        }}
                        passwordField
                    />
                );
            }}
            rules={{ required: { value: true, message: Strings('label.require_field') } }}
        />
    );

    const [loading, setLoading] = useState(false);
    const submitButtonEnable = !!watch('old')
        && !!watch('newPass') && !!watch('confirm');

    const submitForm = (formData) => {
        const { old, newPass } = formData;
        const requestData = {
            old_password: old,
            new_password: newPass,
        };
        setLoading(true);
        setTimeout(() => {
            ApiHelper.post(Constants.CHANGE_PASSWORD_PATH, requestData)
                .then(async ({ data }) => {
                    setTimeout(async () => {
                        const accessToken = data.token_id;
                        await Storage.setData(Constants.KEY_ACCESS_TOKEN, accessToken);
                        Utils.showToast(Strings('message.password_updated'));
                        navigation.goBack();
                    }, 300);
                })
                .catch((error) => {
                    Utils.showToast(Strings('message.server_error'));
                })
                .finally(() => {
                    setLoading(false);
                });
        }, 400);
    };

    return (
        <AppContainer
            header={(
                <AirportBookingHeader
                    navigation={navigation}
                    title={Strings('header.change_password')}
                />
            )}
        >
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
            >
                <KeyboardAvoidingView
                    behavior="padding"
                    style={{ flex: 1 }}
                >

                    <View style={styles.container}>
                        {passwordField('old', oldRef, Strings('label.old_password'), newRef)}
                        {passwordField('newPass', newRef, Strings('label.new_password'), confirmRef)}
                        {passwordField('confirm', confirmRef, Strings('label.confirm_password'))}
                    </View>
                    <AppButton
                        onPress={handleSubmit(submitForm)}
                        text={Strings('label.submit_change')}
                        containerStyle={{
                            marginTop: normalize(16),
                        }}
                        disabled={!submitButtonEnable}
                    />
                </KeyboardAvoidingView>
            </KeyboardAwareScrollView>
            <AppLoading
                isVisible={loading}
            />
        </AppContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        ...Styles.cardShadowStyle,
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        paddingHorizontal: normalize(16),
        paddingBottom: normalize(16),
    },
});
