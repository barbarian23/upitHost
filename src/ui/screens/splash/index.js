import React, { Component } from 'react';
import { Image, Platform, View } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import { checkNotifications, requestNotifications, RESULTS } from 'react-native-permissions';
import styles from './styles';
import { Constants, Storage, Utils } from '../../../commons';
import { translationGetters } from '../../../utils/LocalizationConfig';
import { checkPermission } from '../../../utils/NotificationUtils';
import * as ApiAccount from '../../../services/apis/ApiAccount';
import { AnimationLoading } from '../../components/loading';
import { normalize } from '../../../commons/utils';
import { connect } from 'react-redux';
import { storeFirebaseToken } from '../../../actions/accountActions';

class SplashScreen extends Component {
    async componentDidMount() {
        await this.setupLanguage();
        await this.checkNotificationPermission();
    }

    async setupLanguage() {
        let language = await Storage.getDataJson(Constants.KEY_LANGUAGE);
        console.log('language::', language);
        if (language) {
            Utils.changeLanguage(language.code);
        } else {
            const fallback = { languageTag: 'vi', isRTL: false };
            const { languageTag } = RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;

            language = Constants.language.find((l) => l.code === languageTag);
            await Storage.setDataJson(Constants.KEY_LANGUAGE, language);
        }
    }

    async checkNotificationPermission() {
        try {
            console.log('CheckFCM Into');
            await checkPermission();
        } catch (error) {
            console.warn('Couldn\'t setup notifications for this user : ', error);
        } finally {
            console.log('CheckFCM finally --> CheckActiveNotificationPermissionOnIOS');
            this.checkAndRequestNotificationPermission();
        }
    }

    checkAndRequestNotificationPermission() {
        if (Platform.OS === 'ios') {
            checkNotifications().then(({ status, settings }) => {
                switch (status) {
                    case RESULTS.DENIED:
                        console.log('The subscreens has not been requested / is denied but requestable');
                        this.requestActiveNotificationPermission(['alert, sound']);
                        break;

                    case RESULTS.UNAVAILABLE:
                        console.log('This feature is not available (on this device / in this context)');
                        this.checkLogin();
                        break;
                    case RESULTS.GRANTED:
                        console.log(`The permission is granted with options${settings}`);
                        if (settings) {
                            let options = [];
                            if (!settings.alert) options.push('alert');
                            if (!settings.sound) options.push('sound');
                            if (options.length > 0) {
                                this.requestActiveNotificationPermission(options);
                            } else {
                                this.checkLogin();
                            }
                        } else {
                            this.checkLogin();
                        }
                        break;
                    default:
                    case RESULTS.BLOCKED:
                        console.log('The subscreens is denied and not requestable anymore');
                        this.checkLogin();
                        break;
                }
            });
        } else {
            this.checkLogin();
        }
    }

    requestActiveNotificationPermission(options) {
        requestNotifications(options).then(() => {
            this.checkLogin();
        });
    }

    checkLogin() {
        Storage.getData(Constants.KEY_ACCESS_TOKEN).then((token) => {
            console.log('ACCESS_TOKEN', token);
            if (token) {
                this.getProfile(token);
                // this.props.dispatch(getProfile());
            } else {
                this.moveToMainScreen(token);
            }
        });
    }

    getProfile(token) {
        const { navigation } = this.props;
        ApiAccount.getProfile()
            .then(
                (response) => {
                    const { dispatch } = this.props;
                    let profile = response.data ? response.data.salepoint : null;
                    // dispatch(saveToStore(profile));
                    // dispatch(requestFetchHouseList());
                    this.moveToMainScreen(token);
                },
            )
            .catch(
                (err) => {
                    if (err.status === Constants.HTTPStatus.CURRENT_VERSION_NEED_TO_UPDATE) {
                        navigation.navigate('VersionUpdate');
                    } else {
                        this.moveToMainScreen(null, true);
                    }
                },
            );
    }

    moveToMainScreen(token, requestFailed = false) {
        console.log('token::', token);
        const { navigation, storeFCMToken } = this.props;
        Storage.getData(Constants.KEY_FIREBASE_FCM_TOKEN)
            .then((fcmToken) => {
                storeFCMToken(fcmToken || '');
                if (!requestFailed && token) {
                    navigation.navigate('Main');
                } else {
                    navigation.navigate('AuthStack');
                }
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={styles.image}
                    source={require('../../../assets/icons/ic_splash.png')}
                />
                <View style={{ height: normalize(250), alignItems: 'center', justifyContent: 'flex-end' }}>
                    <AnimationLoading
                        style={{ width: normalize(60), height: normalize(60) }}
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = () => ({});

export const mapDispatchToProps = (dispatch) => ({
    storeFCMToken: (token) => dispatch(storeFirebaseToken(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
