import React, { Component, useRef } from 'react';
import { KeyboardAvoidingView, TouchableOpacity, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import AppText from '../../../components/text/AppTextView';
import Strings from '../../../../utils/LocalizationConfig';
import AppInput from '../../../components/form/AppInput';
import renderIf, { normalize } from '../../../../commons/utils';
import AppButton from '../../../components/button/AppButton';
import AuthHeader from '../../../components/header/authHeader/AuthHeader';
import { Constants, Storage, Utils } from '../../../../commons';
import * as ApiAccount from '../../../../services/apis/ApiAccount';
import AppLoading from '../../../components/loading';

export default class SignInScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firebaseToken: '',
            loading: false,
        };
    }

    async componentDidMount() {
        const firebaseToken = await Storage.getData(Constants.KEY_FIREBASE_FCM_TOKEN) || '';
        this.setState({
            firebaseToken,
        });

        const { navigation } = this.props;
        const { params = { email: '' } } = navigation.state;
        if (params) {
            const { email = '' } = params;
            this.setState({
                prefilledEmail: email,
            });
        }
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
                <AppText style={styles.titleText}>{Strings('label.login_screen_title')}</AppText>
                <AppText style={styles.descriptionText}>{Strings('label.login_screen_description')}</AppText>
            </View>
        );
    }

    renderForm() {
        const { prefilledEmail } = this.state;

        return (
            <KeyboardAvoidingView behavior="padding">
                <LoginForm
                    prefilledEmail={prefilledEmail}
                    onSubmit={({ email, password }) => {
                        this.login(email, password);
                    }}
                />
            </KeyboardAvoidingView>
        );
    }

    renderForgotPasswordNavigation() {
        const { navigation } = this.props;

        return (
            <View style={{ marginTop: normalize(28) }}>
                <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
                    <AppText style={styles.forgetPassword}>{Strings('label.forget_password')}</AppText>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const { loading, prefilledEmail } = this.state;
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.content}>
                        {this.renderTitle()}
                        {renderIf(prefilledEmail !== undefined, this.renderForm())}
                        {this.renderForgotPasswordNavigation()}
                    </View>
                </KeyboardAwareScrollView>
                <AppLoading
                    isVisible={loading}
                />
            </View>
        );
    }

    login(email, password) {
        const { firebaseToken } = this.state;

        const requestBody = {
            email,
            password,
            tokenFirebase: firebaseToken,
        };
        this.setState({
            loading: true,
        }, () => {
            ApiAccount.signIn(requestBody).then(async ({ data }) => {
                const { name, avatar, token_id } = data;
                const quickSignInData = {
                    name,
                    email,
                    avatar,
                    token: token_id,
                };

                await Utils.checkAndStorageQuickLoginData(quickSignInData);
                await Storage.setData(Constants.KEY_ACCESS_TOKEN, token_id);
                this.setState({
                    loading: false,
                }, () => this.navigateToMainScreen());
            }).catch((error) => {
                this.setState({
                    loading: false,
                });
                setTimeout(() => {
                    Utils.showToast(error.message);
                }, 400);
            });
        });
    }

    navigateToMainScreen() {
        const { navigation } = this.props;
        navigation.navigate('Main');
    }
}

export function LoginForm(props) {
    const { onSubmit, prefilledEmail } = props;
    const { control, handleSubmit, clearErrors, errors } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
    });

    const emailRef = useRef();
    const passwordRef = useRef();

    const formError = Utils.getFormError(errors);

    return (
        <View style={styles.form}>
            <Controller
                control={control}
                name="email"
                defaultValue={prefilledEmail}
                render={({ value, onChange }) => {
                    const error = (formError[0] === '' || formError[0] !== 'email') ? null : formError[1];
                    return (
                        <AppInput
                            ref={emailRef}
                            label={Strings('label.email')}
                            placeholder={Strings('label.enter_email')}
                            value={value}
                            onChangeText={(text) => {
                                onChange(text);
                                clearErrors();
                            }}
                            error={error}
                        />
                    );
                }}
                rules={{ required: { value: true, message: Strings('label.require_field') } }}
            />

            <Controller
                name="password"
                defaultValue=""
                control={control}
                render={({ value, onChange }) => {
                    const error = (formError[0] === '' || formError[0] !== 'password') ? null : formError[1];
                    return (
                        <AppInput
                            passwordField
                            ref={passwordRef}
                            containerStyle={{ marginTop: normalize(16) }}
                            label={Strings('label.password')}
                            placeholder={Strings('label.enter_password')}
                            value={value}
                            onChangeText={(text) => {
                                onChange(text);
                                clearErrors();
                            }}
                            secureTextEntry
                            error={error}
                        />
                    );
                }}
                rules={{ required: { value: true, message: Strings('label.require_field') } }}
            />

            <AppButton
                onPress={handleSubmit(onSubmit)}
                containerStyle={{ marginTop: normalize(32) }}
                text={Strings('label.login')}
            />
        </View>
    );
}
