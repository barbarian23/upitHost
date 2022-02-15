import React, { useRef } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import Strings from '../../../../../../utils/LocalizationConfig';
import BookingInput from '../../../../../components/form/BookingInput';
import { Colors, Styles, Utils } from '../../../../../../commons';
import renderIf, { normalize } from '../../../../../../commons/utils';
import AppButton from '../../../../../components/button/AppButton';
import { ROUTE_FROM_AIRPORT } from '../../../../../../commons/const';

function onSubmitEditing(ref, nextRef) {
    ref.current.blur();
    nextRef.current.focus();
}

const passengerNameInput = (defaultValue, ref, nextRef, { control, clearErrors }, formError) => (
    <Controller
        name="passengerName"
        control={control}
        render={({ value, onChange }) => {
            const error = (formError[0] === '' || formError[0] !== 'passengerName') ? null : formError[1];
            return (
                <BookingInput
                    inputIcon={require('../../../../../../assets/icons/ic_user.png')}
                    ref={ref}
                    label={Strings('label.passenger_name')}
                    placeholder={Strings('label.input_name_of_passenger')}
                    value={value}
                    onChangeText={(text) => {
                        onChange(text);
                        clearErrors();
                    }}
                    error={error}
                    onSubmitEditing={() => onSubmitEditing(ref, nextRef)}
                    autoCapitalize="words"
                />
            );
        }}
        rules={{ required: { value: true, message: Strings('label.require_field') } }}
    />
);

const passengerPhoneNumber = (defaultValue, ref, nextRef, { control, clearErrors }, formError) => (
    <Controller
        name="passengerPhoneNumber"
        control={control}
        render={({ value, onChange }) => {
            const error = (formError[0] === '' || formError[0] !== 'passengerPhoneNumber') ? null : formError[1];
            return (
                <BookingInput
                    optional
                    keyboardType="phone-pad"
                    error={error}
                    containerStyle={{ marginTop: normalize(24) }}
                    inputIcon={require('../../../../../../assets/icons/ic_phone.png')}
                    ref={ref}
                    label={Strings('label.phone_number')}
                    placeholder={Strings('label.input_phone_number')}
                    value={value}
                    onChangeText={(text) => {
                        onChange(text);
                        clearErrors();
                    }}
                    onSubmitEditing={() => onSubmitEditing(ref, nextRef)}
                />
            );
        }}
    />
);

const flightCode = (defaultValue, ref, nextRef, { control, clearErrors }, formError) => (
    <Controller
        name="flightCode"
        control={control}
        render={({ value, onChange }) => {
            const error = (formError[0] === '' || formError[0] !== 'flightCode') ? null : formError[1];
            return (
                <BookingInput
                    maxLength={7}
                    error={error}
                    containerStyle={{ marginTop: normalize(24) }}
                    inputIcon={require('../../../../../../assets/icons/ic_ticket.png')}
                    ref={ref}
                    label={Strings('label.flight_code')}
                    placeholder={Strings('label.input_flight_code')}
                    value={value}
                    onChangeText={(text) => {
                        onChange(text);
                        clearErrors();
                    }}
                    autoCapitalize="characters"
                    onSubmitEditing={() => onSubmitEditing(ref, nextRef)}
                />
            );
        }}
        rules={{
            required: {
                value: true,
                message: Strings('label.require_field'),
            },
            pattern: {
                value: /^([A-Z]{2,3})\d{2,4}/,
                message: Strings('label.flight_code_not_valid'),
            },
            min: {
                value: 6,
                message: Strings('label.flight_code_not_valid'),
            },
        }}
    />
);

const noteForDriver = (defaultValue, ref, nextRef, { control, clearErrors }) => (
    <Controller
        name="noteForDriver"
        control={control}
        render={({ value, onChange }) => (
            <BookingInput
                multiline
                optional
                containerStyle={{ marginTop: normalize(24), marginBottom: normalize(16) }}
                inputIcon={require('../../../../../../assets/icons/ic_note.png')}
                ref={ref}
                label={Strings('label.note_for_driver')}
                placeholder={Strings('label.input_note_for_driver')}
                value={value}
                onChangeText={(text) => {
                    onChange(text);
                    clearErrors();
                }}
            />
        )}
    />
);

const getEditData = (navigation) => {
    const editData = Utils.getAllParamFromNavigation(navigation);
    return {
        defaultName: (editData && editData.passengerName) ? editData.passengerName : '',
        defaultPhoneNumber: (editData && editData.passengerPhoneNumber) ? editData.passengerPhoneNumber : '',
        defaultFlightCode: (editData && editData.flightCode) ? editData.flightCode : '',
        defaultNote: (editData && editData.noteForDriver) ? editData.noteForDriver : '',
        editPassengerInfo: editData ? editData.editPassengerInformation : false,
        editPassengerCallback: editData ? editData.callback : null,
    };
};

const confirmBookingTitle = (edit) => (
    edit ? Strings('label.edit') : Strings('header.confirm_booking')
);

export default function AirportCarStep2(props) {
    const { navigation, nextRoute } = props;

    const {
        defaultName, defaultPhoneNumber,
        defaultFlightCode, defaultNote, editPassengerInfo, editPassengerCallback,
    } = getEditData(navigation);

    const { route, service, editFromStep1 } = Utils.getAllParamFromNavigation(navigation);

    const submitForm = (data) => {
        if (editPassengerInfo) {
            if (editFromStep1) {
                navigation.pop(2);
                editPassengerCallback({
                    ...Utils.getAllParamFromNavigation(navigation),
                    ...data,
                });
            } else {
                navigation.goBack();
                editPassengerCallback(data);
            }
        } else {
            const bookingParams = {
                ...Utils.getAllParamFromNavigation(navigation),
                ...data,
            };
            // console.log('bookingParams', bookingParams);
            navigation.navigate(nextRoute, {
                ...bookingParams,
                service,
            });
        }
    };

    // const { control, handleSubmit, clearErrors, errors } = useForm({
    const form = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            passengerName: defaultName,
            passengerPhoneNumber: defaultPhoneNumber,
            flightCode: defaultFlightCode,
            noteForDriver: defaultNote,
        },
    });

    const nameRef = useRef();
    const phoneNumberRef = useRef();
    const flightCodeRef = useRef();
    const noteRef = useRef();

    const formError = Utils.getFormError(form.errors);

    const fromAirport = route === ROUTE_FROM_AIRPORT;
    const flightCodeRequire = (service === 'UP') && fromAirport;

    const submitButtonEnable = !!form.watch('passengerName') && (flightCodeRequire === !!form.watch('flightCode'));

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
            >
                <KeyboardAvoidingView
                    style={{
                        margin: normalize(16),
                        backgroundColor: Colors.COLOR_NEUTRAL_6,
                        padding: normalize(16),
                        ...Styles.cardShadowStyle,
                    }}
                    behavior="padding"
                >
                    {passengerNameInput(defaultName, nameRef, phoneNumberRef, form, formError)}
                    {passengerPhoneNumber(defaultPhoneNumber, phoneNumberRef, fromAirport ? flightCodeRef : noteRef, form, formError)}
                    {renderIf(flightCodeRequire, flightCode(defaultFlightCode, flightCodeRef, noteRef, form, formError))}
                    {noteForDriver(defaultNote, noteRef, null, form, formError)}

                </KeyboardAvoidingView>
            </KeyboardAwareScrollView>
            <View
                style={styles.buttonContainer}
            >
                <AppButton
                    disabled={!submitButtonEnable}
                    text={confirmBookingTitle(editPassengerInfo)}
                    onPress={form.handleSubmit(submitForm)}
                />
            </View>
        </View>
    );
}
