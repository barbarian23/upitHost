import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppContainer from '../../../../components/container';
import AirportBookingHeader from '../../../../components/header/authHeader/AirportBookingHeader';
import Strings from '../../../../../utils/LocalizationConfig';
import { Colors, Styles, Utils } from '../../../../../commons';
import BookingInput from '../../../../components/form/BookingInput';
import renderIf, { normalize } from '../../../../../commons/utils';
import AppButton from '../../../../components/button/AppButton';
import { editProfile } from '../../../../../actions/accountActions';
import AppLoading from '../../../../components/loading';

export default function EditProfile({ navigation }) {

    const renderHeader = () => (
        <AirportBookingHeader
            navigation={navigation}
            title={Strings('header.edit_profile')}
        />
    );

    const profile = useSelector((state) => state.accountReducer.profile.data);
    const loading = useSelector((state) => state.accountReducer.profile.loading);

    const dispatch = useDispatch();

    const { control, clearErrors, errors, watch, handleSubmit } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            name: profile ? profile.name : '',
            phoneNumber: profile ? profile.phoneNumber : '',
        },
    });

    const nameRef = useRef();
    const phoneNumberRef = useRef();

    const formError = Utils.getFormError(errors);

    function backToProfile() {
        Utils.showToast(Strings('message.update_successfully'));
        setTimeout(() => {
            navigation.goBack();
        }, 400);
    }

    const submitForm = (formData) => {
        setTimeout(() => {
            dispatch(editProfile(formData, () => backToProfile()));
        }, 400);
    };

    const nameField = () => (
        <Controller
            name="name"
            control={control}
            render={({ value, onChange }) => {
                const error = (formError[0] === '' || formError[0] !== 'name') ? null : formError[1];
                return (
                    <BookingInput
                        inputIcon={require('../../../../../assets/icons/ic_user.png')}
                        ref={nameRef}
                        label={Strings('label.full_name')}
                        placeholder={Strings('label.input_full_name')}
                        value={value}
                        onChangeText={(text) => {
                            onChange(text);
                            clearErrors();
                        }}
                        error={error}
                        onSubmitEditing={() => {
                            nameRef.current.blur();
                            phoneNumberRef.current.focus();
                        }}
                        autoCapitalize="words"
                    />
                );
            }}
            rules={{ required: { value: true, message: Strings('label.require_field') } }}
        />
    );

    const phoneNumberField = () => (
        <Controller
            name="phoneNumber"
            control={control}
            render={({ value, onChange }) => {
                const error = (formError[0] === '' || formError[0] !== 'phoneNumber') ? null : formError[1];
                return (
                    <BookingInput
                        keyboardType="phone-pad"
                        error={error}
                        containerStyle={{ marginTop: normalize(24) }}
                        inputIcon={require('../../../../../assets/icons/ic_phone.png')}
                        ref={phoneNumberRef}
                        label={Strings('label.phone_number')}
                        placeholder={Strings('label.input_phone_number')}
                        value={value}
                        onChangeText={(text) => {
                            onChange(text);
                            clearErrors();
                        }}
                        onSubmitEditing={() => {
                            phoneNumberRef.current.blur();
                        }}
                    />
                );
            }}
            rules={{ required: { value: true, message: Strings('label.require_field') } }}
        />
    );

    const submitButtonEnable = !!watch('name')
        && !!watch('phoneNumber');

    return (
        <AppContainer
            header={renderHeader()}
        >
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
            >
                <KeyboardAvoidingView
                    behavior="padding"
                    style={{ flex: 1 }}
                >
                    <View style={styles.formContainer}>
                        {nameField()}
                        {phoneNumberField()}
                    </View>

                    <View
                        style={{
                            backgroundColor: Colors.COLOR_NEUTRAL_6,
                            marginTop: normalize(16),
                        }}
                    >
                        <AppButton
                            disabled={!submitButtonEnable}
                            text={Strings('label.edit_complete')}
                            onPress={handleSubmit(submitForm)}
                        />
                    </View>
                </KeyboardAvoidingView>
                {renderIf(loading,
                    <AppLoading />)}
            </KeyboardAwareScrollView>
        </AppContainer>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        ...Styles.cardShadowStyle,
        backgroundColor: Colors.COLOR_NEUTRAL_6,
        padding: normalize(16),
    },
});
