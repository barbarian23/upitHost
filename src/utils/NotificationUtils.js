import AsyncStorage from '@react-native-community/async-storage';
import { firebase } from '@react-native-firebase/messaging';
import { Constants } from '../commons';

// 3
export async function getToken() {
    let fcmToken = await AsyncStorage.getItem(Constants.KEY_FIREBASE_FCM_TOKEN);
    console.log('fcm::', fcmToken);
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem(Constants.KEY_FIREBASE_FCM_TOKEN, fcmToken);
        }
        console.log('fcm::', fcmToken);
    }
}

// 2
export async function requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        await getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('subscreens rejected', error);
    }
}

// 1
export async function checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        await getToken();
    } else {
        await requestPermission();
    }
}
