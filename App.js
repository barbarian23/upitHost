/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import 'react-native-gesture-handler';

import React, { Component } from 'react';

import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import { Provider } from 'react-redux';
import { AppearanceProvider } from 'react-native-appearance';
import messaging from '@react-native-firebase/messaging';
import configurationStore from './src/boot/AppReduxStore';

import { Colors, Navigation } from './src/commons';
import AppNavigator from './src/boot/AppNavigator';
import { setI18nConfig } from './src/utils/LocalizationConfig';

import {
    addNewBookingRide,
    addNewCompleteRide,
    addNewConfirmRide,
    ridingTrip,
    updateRide,
} from './src/ui/screens/main/status/statusActions';
import {
    NOTIFY_ACCEPT,
    NOTIFY_BOOK,
    NOTIFY_COMPLETE,
    NOTIFY_LOCATION_DRIVER,
    NOTIFY_PSG_PICKED_UP,
    NOTIFY_UPDATE,
} from './src/commons/const';
import { updateDriverLocation } from './src/ui/screens/main/tracking/trackingAction';
import 'moment/locale/vi';

export default class App extends Component {
    constructor(props: any) {
        super(props);
        setI18nConfig();
        this.store = configurationStore();
    }

    componentDidMount() {
        this.messageListener = messaging().onMessage((message: any) => {
            console.log(
                'NewMessage::',
                JSON.parse(message.data.data),
            );
            let data = JSON.parse(message.data.data);
            let notifyAction = null;
            switch (data.type) {
                case NOTIFY_BOOK: {
                    notifyAction = addNewBookingRide(data);
                    break;
                }
                case NOTIFY_ACCEPT: {
                    notifyAction = addNewConfirmRide(data);
                    break;
                }
                case NOTIFY_COMPLETE: {
                    notifyAction = addNewCompleteRide(data);
                    break;
                }
                case NOTIFY_LOCATION_DRIVER: {
                    notifyAction = updateDriverLocation(data);
                    break;
                }
                case NOTIFY_UPDATE: {
                    notifyAction = updateRide(data);
                    break;
                }
                case NOTIFY_PSG_PICKED_UP: {
                    notifyAction = ridingTrip(data);
                    break;
                }
                default:
                    break;
            }

            if (notifyAction) {
                this.store.dispatch(notifyAction);
            }
        });
    }

    componentWillUnmount() {
        this.messageListener();
    }

    render(): any {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <AppearanceProvider>
                    <Provider store={this.store}>
                        <StatusBar
                            backgroundColor={Colors.COLOR_NEUTRAL_7}
                            barStyle="dark-content"
                        />
                        <AppNavigator
                            ref={(navigationRef: any) => {
                                Navigation.setTopLevelNavigator(navigationRef);
                            }}
                        />
                    </Provider>
                </AppearanceProvider>
            </SafeAreaView>
        );
    }
}
