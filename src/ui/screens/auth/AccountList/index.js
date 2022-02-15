import React, { Component } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import styles from './styles';
import AppText from '../../../components/text/AppTextView';
import Strings from '../../../../utils/LocalizationConfig';
import AppButton from '../../../components/button/AppButton';
import { normalize } from '../../../../commons/utils';
import AuthHeader from '../../../components/header/authHeader/AuthHeader';
import { Constants, Storage, Utils } from '../../../../commons';
import ApiHelper from '../../../../services/apis/ApiHelper';

export default class AccountList extends Component {
    constructor() {
        super();
        this.state = {
            accountList: [],
        };
    }

    async componentDidMount() {
        const { navigation } = this.props;
        const { params } = navigation.state;

        if (params) {
            const { accountList } = params;
            this.setState({
                accountList,
            });
        } else {
            const accountList = await Storage.getDataJson(Constants.KEY_PREVIOUS_USER_LIST);
            this.setState({
                accountList,
            });
        }
    }

    renderHeader() {
        const { navigation } = this.props;
        return (
            <AuthHeader navigation={navigation} />
        );
    }

    renderAccount(account) {
        const { avatar, email, token } = account;

        return (
            <TouchableOpacity onPress={() => this.checkTokenExpiration(email, token)}>
                <View style={styles.accountContainer}>
                    <Avatar
                        rounded
                        source={{
                            uri: (avatar) ? Constants.API_GET_IMAGE_URL(avatar) : Constants.DEFAULT_IMAGE_URL,
                        }}
                        size="medium"
                    />
                    <View style={styles.accountNameEmailContainer}>
                        <AppText numberOfLines={1} style={styles.accountName}>{account.name}</AppText>
                        <AppText numberOfLines={1} style={styles.accountEmail}>{account.email}</AppText>
                    </View>
                    <TouchableOpacity
                        onPress={() => this.removeAccount(account)}
                        style={styles.accountRemoveContainer}
                    >
                        <Image
                            style={styles.accountRemove}
                            source={require('../../../../assets/icons/ic_close.png')}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    }

    renderAccountList() {
        const { accountList } = this.state;
        const { navigation } = this.props;

        return (
            <View style={styles.listContainer}>
                <View style={styles.listHeader}>
                    <AppText style={styles.listHeaderAccount}>{Strings('label.your_accounts')}</AppText>
                    {/*<TouchableOpacity>*/}
                    {/*    <AppText style={styles.listHeaderEdit}>{Strings('label.edit')}</AppText>*/}
                    {/*</TouchableOpacity>*/}
                </View>
                <ScrollView style={{ flex: 1 }}>
                    {accountList.map((account) => (this.renderAccount(account)))}
                    <AppButton
                        onPress={() => navigation.navigate('SignIn')}
                        containerStyle={{ marginTop: normalize(32) }}
                        text={Strings('label.add_new_account')}
                        textIcon={(
                            <Image
                                style={styles.plusIcon}
                                source={require('../../../../assets/icons/ic_plus.png')}
                            />
                        )}
                    />
                </ScrollView>

            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                {this.renderAccountList()}
            </View>
        );
    }

    checkTokenExpiration = (email, token) => {
        const { navigation } = this.props;
        const config = {
            headers: {
                access_token: token,
                'Content-Type': 'application/json;charset=UTF-8',
            },
        };
        ApiHelper.post(Constants.CHECK_TOKEN_EXPIRATION, null, config)
            .then(async ({ message }) => {
                if (message) {
                    await Storage.setData(Constants.KEY_ACCESS_TOKEN, token);
                    navigation.navigate('Main');
                } else {
                    Utils.showToast(Strings('message.session_expired'));
                    navigation.navigate('SignIn', { email });
                }
            })
            .catch(() => {
                Utils.showToast(Strings('message.server_error'));
                navigation.navigate('SignIn', { email });
            });
    };

    async removeAccount(remove) {
        const { accountList } = this.state;
        const { navigation } = this.props;

        const filter = accountList.filter((acc) => remove.email !== acc.email);
        await Storage.setDataJson(Constants.KEY_PREVIOUS_USER_LIST, filter);
        this.setState({
            accountList: filter,
        }, () => {
            if (filter.length === 0) {
                navigation.replace('SignIn');
            }
        });
    }
}
