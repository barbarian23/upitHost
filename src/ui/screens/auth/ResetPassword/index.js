import React, { Component, useRef } from 'react';
import { View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import styles from './styles';
import AppText from '../../../components/text/AppTextView';
import Strings from '../../../../utils/LocalizationConfig';
import AppInput from '../../../components/form/AppInput';
import { normalize } from '../../../../commons/utils';
import AppButton from '../../../components/button/AppButton';
import AuthHeader from '../../../components/header/authHeader/AuthHeader';
import ApiHelper from '../../../../services/apis/ApiHelper';
import { Constants, Utils } from '../../../../commons';
import ResetPasswordOverlay, { LOADING_STATE, SUCCESS_STATE } from './overlay';

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: null,
        };
    }

    renderHeader() {
        const { navigation } = this.props;
        return (
            <AuthHeader navigation={navigation} />
        );
    }

    renderTitle() {
        return (
            <View style={styles.title}>
                <AppText style={styles.titleText}>{Strings('label.reset_password')}</AppText>
                <AppText style={styles.descriptionText}>{Strings('label.reset_password_description')}</AppText>
            </View>
        );
    }

    renderForm() {
        return (
            <ResetPasswordForm
                onSubmit={({ email }) => this.resetPassword(email)}
            />
        );
    }

    renderLoading() {
        const { loading } = this.state;
        const { navigation } = this.props;

        return (
            <ResetPasswordOverlay
                visible={loading}
                onSuccessGoToLogin={() => {
                    this.setState({
                        loading: null,
                    });
                    setTimeout(() => {
                        navigation.goBack();
                    }, 400);
                }}
            />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                <View style={styles.content}>
                    {this.renderTitle()}
                    {this.renderForm()}
                </View>
                {this.renderLoading()}
            </View>
        );
    }

    resetPassword(email) {
        const data = {
            email,
        };
        this.setState({
            loading: LOADING_STATE,
        });
        setTimeout(() => {
            ApiHelper.post(Constants.FORGET_PASSWORD_PATH, data).then(
                ({ message, description }: any) => {
                    if (message) {
                        this.setState({
                            loading: SUCCESS_STATE,
                        });
                    } else {
                        this.setState({
                            loading: null,
                        });
                        setTimeout(() => {
                            Utils.showToast(description);
                        }, 400);
                    }
                },
            ).catch(
                (error: any) => {
                    let message = error && error.message ? error.message : Strings('message.server_error');
                    this.setState({
                        loading: null,
                    });
                    setTimeout(() => {
                        Utils.showToast(message);
                    }, 400);
                },
            );
        }, 400);
    }
}

export function ResetPasswordForm(props) {
    const { onSubmit } = props;
    const { control, handleSubmit, clearErrors } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
    });
    const emailRef = useRef();

    return (
        <View style={styles.form}>
            <Controller
                control={control}
                name="email"
                defaultValue=""
                render={({ value, onChange }) => (
                    <AppInput
                        ref={emailRef}
                        label={Strings('label.email')}
                        placeholder={Strings('label.enter_email')}
                        value={value}
                        onChangeText={(text) => {
                            onChange(text);
                            clearErrors();
                        }}
                    />
                )}
            />

            <AppButton
                onPress={handleSubmit(onSubmit)}
                containerStyle={{ marginTop: normalize(32) }}
                text={Strings('label.send_email')}
            />
        </View>
    );
}
