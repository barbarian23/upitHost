package com.updehost.modules;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.ViewManager;
import com.vtc.sdkpay2.function.ICallback;
import com.vtc.sdkpay2.function.VTCPaySDK;
import com.vtc.sdkpay2.model.VTCAppInfoModel;

import java.util.List;

public class VtcPay extends ReactContextBaseJavaModule {


    public VtcPay(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "vtcPay";
    }

    @ReactMethod
    public void attempPurchase(String merchantAppID,
                               String merchantAccountName,
                               String appSecretKey,
                               String amount,
                               Integer paymentType,
                               String orderCode,
                               String receiveAccount,
                               Boolean isTest,
                               Callback successCallback,
                               Callback errorCallback) {
//        String merchantAppID = "";
//        String merchantAccountName = "";
//        String appSecretKey = "";

        // Sandbox
//        String merchantAppID = "500048054";
//        String merchantAccountName = "0963465816";
//        String appSecretKey = "handy@123";

        VTCAppInfoModel mModel = new VTCAppInfoModel(merchantAppID, merchantAccountName, appSecretKey);
        mModel.setAmount(Float.parseFloat(amount));
        mModel.setPaymentType(paymentType);
        mModel.setCurrency(VTCPaySDK.VND);
        mModel.setOrderCode(orderCode + "");
        mModel.setReceiverAccount(receiveAccount);
        mModel.setEnvironment((isTest) ? VTCPaySDK.ALPHA_URL : VTCPaySDK.LIVE_URL);
        VTCPaySDK.getInstance().nextFunctionVTCPay(getCurrentActivity(), VTCPaySDK.PAYMENT, mModel, (i, s) -> {
            if (i == 1) {
                successCallback.invoke(i, s);
            } else {
                errorCallback.invoke(i, s);
            }
//            }
        });

    }
}
