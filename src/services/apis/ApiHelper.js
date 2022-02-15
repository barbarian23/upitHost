import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from 'react-native';
import { Constants, Storage } from '../../commons';
import { HTTPStatus } from '../../commons/const';
import { navigate } from '../../commons/navigation';
import Strings from '../../utils/LocalizationConfig';

/**
 * parse response
 */
function parseBody(response) {
//  if (response.status === 200 && response.data.status.code === 200) { // - if use custom status code
    console.log('CheckResponse: ', response);
    if (response.status === 200 || response.status === 201) {
        if (response.data) {
            if (response.data.message) {
                return response.data;
            }
            return Promise.reject({ message: response.data.description });
        }
        return Promise.reject({ message: response });
    }
    return Promise.reject({ message: 'Network Error' });
}

const EXCEPTION_UNAUTHORIZED_API = [
    'signin',
];

async function handleError(error) {
    console.log('Error', error.response);
    if (error.response && error.response.status === HTTPStatus.UNAUTHORIZED) {
        let exception = false;
        EXCEPTION_UNAUTHORIZED_API.forEach((exp) => {
            if (error.response.config.url.includes(exp)) {
                exception = true;
            }
        });

        if (!exception) {
            navigate('QuickSignIn');
            await Storage.removeData(Constants.KEY_USER);
            await Storage.removeData(Constants.KEY_ACCESS_TOKEN);
            return Promise.reject({ message: 'Token expired' });
        }
        return Promise.reject({ message: Strings('server_message.'.concat(error.response.data.code)) });
    }
    if (error.response && error.response.status === HTTPStatus.CURRENT_VERSION_NEED_TO_UPDATE) {
        navigate('VersionUpdate');
        return Promise.reject({
            status: HTTPStatus.CURRENT_VERSION_NEED_TO_UPDATE,
            messages: 'Version out of date',
        });
    }
    if (error.response) {
        return Promise.reject({ messages: error.response.data });
    }
    return Promise.reject(error);
}

/**
 * axios instance
 */
const ApiHelper = axios.create({
    baseURL: Constants.BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
});

// request header
ApiHelper.interceptors.request.use(async (config) => {
    // Do something before request is sent
    let accessToken = await AsyncStorage.getItem(Constants.KEY_ACCESS_TOKEN);
    if (accessToken) {
        config.headers = {
            ...config.headers,
            access_token: accessToken,
            language: Strings('language'),
            'x-app-name': 'upde-host',
            'x-device': Platform.OS,
            'x-app-version': Constants.VERSION(),
        };
    }

    console.log('Starting Request', config);
    return config;
}, (error) => Promise.reject(error));

// response parse
ApiHelper.interceptors.response.use((response) => parseBody(response), (error) => {
    console.warn('Error status', error.response);
    // return Promise.reject(error)
    return handleError(error);
});

export default ApiHelper;
