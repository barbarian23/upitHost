import { NativeModules } from 'react-native';
import { Constants } from '../commons';

export const VTC_PAY = 1;
export const BANK_NOIDIA = 2;
export const BANK_QUOCTE = 3;
export const BANK_GANKET = 4;

const { APP_ID, APP_SECRET, ACCOUNT_NAME, RECEIVE_ACCOUNT } = Constants.VTC_PAYMENT_INFO;

export const vtcOnlinePurchase = (amount, orderCode, successCallback, errorCallback) => {
    let { vtcPay } = NativeModules;
    vtcPay.attempPurchase(
        APP_ID,
        ACCOUNT_NAME,
        APP_SECRET,
        amount,
        BANK_NOIDIA,
        orderCode,
        RECEIVE_ACCOUNT,
        false,
        successCallback,
        errorCallback,
    );
};
