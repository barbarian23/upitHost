import axios from 'axios';
import { Constants } from '../../commons';
import { HTTPStatus } from '../../commons/const';
import Strings from '../../utils/LocalizationConfig';

async function handleError(error) {
    console.log('Error', error.response);
    if (error.response && error.response.status === HTTPStatus.UNAUTHORIZED) {
        return Promise.reject({ message: Strings('server_message.'.concat(error.response.data.code)) });
    }
    if (error.response) {
        return Promise.reject({ messages: error.response.data });
    }
    return Promise.reject(error);
}

let externalApiHelperInstance = axios.create({
    baseURL: Constants.BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
});

// request header no auth
externalApiHelperInstance.interceptors.request.use(async (config) => {
    console.log('Starting Request', config);
    return config;
}, (error) => Promise.reject(error));

externalApiHelperInstance.interceptors.response.use((response) => {
    console.log('CheckResponse: ', response);
    return response;
}, (error) => {
    console.warn('Error status', error.response);
    // return Promise.reject(error)
    return handleError(error);
});

export default externalApiHelperInstance;
