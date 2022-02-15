import React, { Component } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-spinkit';
import moment from 'moment';
import styles from './styles';
import AppText from '../../../components/text/AppTextView';
import Strings from '../../../../utils/LocalizationConfig';
import { normalize } from '../../../../commons/utils';
import { Colors, Constants, Storage, Utils } from '../../../../commons';

export default class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageError: false,
        };
    }

    componentDidMount() {
        this.getProfileDataFromProps();
        this.getDebtDataFromProps();
        this.getHouseListFromProps();
    }

    renderProfileSummary() {
        const { profile, navigation } = this.props;
        const { imageError } = this.state;

        return (
            <View>
                <TouchableOpacity style={styles.imageContainer}>
                    <Image
                        source={imageError ? require('../../../../assets/icons/ic_default_image.png') : {
                            uri: (profile && profile.avatar)
                                ? Constants.API_GET_IMAGE_URL(profile.avatar)
                                : Constants.DEFAULT_IMAGE_URL,
                        }}
                        style={styles.profileImage}
                        onError={() => {
                            this.setState({
                                imageError: true,
                            });
                        }}
                    />
                    <View
                        style={styles.imageFooter}
                    >
                        <Image
                            source={require('../../../../assets/icons/ic_plus.png')}
                            style={styles.plus}
                        />
                    </View>
                </TouchableOpacity>

                <View
                    style={styles.profileInformationContainer}
                >
                    <AppText
                        numberOfLines={1}
                        bold
                        style={styles.name}
                    >
                        {profile ? profile.name : ''}
                    </AppText>
                    <AppText
                        numberOfLines={1}
                        style={styles.email}
                    >
                        {profile ? profile.email : ''}
                    </AppText>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('EditProfile');
                        }}
                    >
                        <AppText style={{ marginTop: normalize(4), color: Colors.COLOR_SECONDARY }}>
                            {Strings('label.edit_profile')}
                        </AppText>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }

    renderIconWithLoading = (loading, source) => ((loading)
        ? (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: normalize(32),
                    height: normalize(32),
                }}
            >
                <Spinner
                    size={15}
                    type="Wave"
                    color={Colors.COLOR_NEUTRAL_6}
                    isVisible
                />
            </View>
        )
        : (
            <Image
                source={source}
                style={{
                    resizeMode: 'contain',
                    width: normalize(32),
                    height: normalize(32),
                    tintColor: Colors.COLOR_NEUTRAL_6,
                }}
            />
        ));

    renderBalance() {
        const { moneyKeeped, isLoadingCurrentDept } = this.props;
        return (
            <View style={styles.balanceContainer}>
                <View style={styles.balanceImageContainer}>
                    {this.renderIconWithLoading(isLoadingCurrentDept, require('../../../../assets/icons/ic_download.png'))}
                </View>
                <View style={{ marginLeft: normalize(16), justifyContent: 'space-between' }}>
                    <AppText style={styles.balanceTitle}>{Strings('label.balance')}</AppText>
                    <AppText bold style={styles.balanceValue}>{Utils.formatVND(moneyKeeped)}</AppText>
                    <AppText style={styles.balanceDescription}>{this.currentDebtDate()}</AppText>
                </View>
            </View>
        );
    }

    getTitleByDebtType = (amount) => (amount > 0 ? Strings('label.own_system_amount') : Strings('label.system_own_amount'));

    getIconByDebtType = (amount) => (amount > 0
        ? require('../../../../assets/icons/ic_round_dollar.png')
        : require('../../../../assets/icons/ic_round_dollar.png'));

    currentDebtDate = () => {
        const now = moment();
        return `${(now.month() + 1 < 10) ? `0${now.month() + 1}` : (now.month() + 1)}/${now.year()}`;
    };

    renderCredit() {
        const { sum, isLoadingCurrentDept, navigation } = this.props;

        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('DeptDetail');
                }}
                style={styles.balanceContainer}
            >
                <View style={styles.balanceImageContainer}>
                    {this.renderIconWithLoading(isLoadingCurrentDept, this.getIconByDebtType(sum))}
                </View>
                <View style={{ marginLeft: normalize(16), justifyContent: 'space-between', flex: 1 }}>
                    <AppText style={styles.balanceTitle}>{this.getTitleByDebtType(sum)}</AppText>
                    <AppText bold style={styles.balanceValue}>{Utils.formatVND(Math.abs(sum))}</AppText>
                    <AppText style={styles.balanceDescription}>{this.currentDebtDate()}</AppText>
                </View>
                <Image
                    style={{ width: normalize(24), height: normalize(24), alignSelf: 'center' }}
                    source={require('../../../../assets/icons/ic_right_arrow.png')}
                />
            </TouchableOpacity>
        );
    }

    getDeptData = () => {
        const { deptList } = this.props;
        let [message, color] = (deptList && deptList.length > 0)
            ? [Strings('label.dept_paid'), Colors.COLOR_GREEN]
            : [Strings('label.no_data'), Colors.COLOR_GREY];
        if (message === Strings('label.dept_paid')) {
            deptList.forEach((dept) => {
                if (dept.amount !== 0 && !Utils.isPaid(dept.status)) {
                    [message, color] = [Strings('label.dept_unpaid'), Colors.COLOR_RED];
                }
            });
        }
        return {
            message,
            color,
        };
    };

    renderTransactionStatus() {
        const { navigation } = this.props;
        const { message, color } = this.getDeptData();
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('TransactionStatus');
                }}
                style={styles.transactionStatus}
            >
                <Image
                    source={require('../../../../assets/icons/ic_detail.png')}
                    style={{ width: normalize(24), height: normalize(24) }}
                />
                <View style={{ marginLeft: normalize(16), flex: 1 }}>
                    <AppText style={styles.bottomSelectionTitle}>{Strings('label.transaction_status')}</AppText>
                    <AppText style={[styles.bottomSelectionDescription, { color }]}>{message}</AppText>
                </View>
                <Image
                    source={require('../../../../assets/icons/ic_right_arrow.png')}
                    style={{ width: normalize(24), height: normalize(24) }}
                />
            </TouchableOpacity>
        );
    }

    renderMyPlaces() {
        const { houseList, navigation } = this.props;
        const { fetchHouseListLoading } = this.props;
        return (
            <TouchableOpacity
                disabled={fetchHouseListLoading}
                onPress={() => navigation.navigate('PlaceList')}
                style={styles.myPlaces}
            >
                <Image
                    source={require('../../../../assets/icons/ic_home.png')}
                    style={{ width: normalize(24), height: normalize(24) }}
                />
                <View style={{ marginLeft: normalize(16), flex: 1 }}>
                    <AppText style={styles.bottomSelectionTitle}>{Strings('label.my_places')}</AppText>
                    <AppText
                        style={styles.bottomSelectionDescription}
                    >
                        {`${houseList ? houseList.length : 0} ${Strings('label.address')}`}
                    </AppText>
                </View>
                <Image
                    source={require('../../../../assets/icons/ic_right_arrow.png')}
                    style={{ width: normalize(24), height: normalize(24) }}
                />
            </TouchableOpacity>
        );
    }

    renderSettings() {
        const { navigation } = this.props;
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('Setting');
                }}
                style={styles.settings}
            >
                <Image
                    source={require('../../../../assets/icons/ic_setting.png')}
                    style={{ width: normalize(24), height: normalize(24) }}
                />
                <View style={{ marginLeft: normalize(16), flex: 1 }}>
                    <AppText style={styles.bottomSelectionTitle}>{Strings('label.setting')}</AppText>
                </View>
                <Image
                    source={require('../../../../assets/icons/ic_right_arrow.png')}
                    style={{ width: normalize(24), height: normalize(24) }}
                />
            </TouchableOpacity>
        );
    }

    renderBottomSelection() {
        return (
            <View style={styles.bottomSelection}>
                {this.renderTransactionStatus()}
                {this.renderMyPlaces()}
                {this.renderSettings()}
            </View>
        );
    }

    renderLogout() {
        return (
            <TouchableOpacity
                onPress={() => this.logout()}
                style={styles.logoutContainer}
            >
                <Image
                    source={require('../../../../assets/icons/ic_logout.png')}
                    style={{ width: normalize(24), height: normalize(24) }}
                />
                <AppText style={{ marginLeft: normalize(24) }}>{Strings('label.log_out')}</AppText>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <ScrollView>
                <View style={{ padding: normalize(16) }}>
                    {this.renderProfileSummary()}
                    {this.renderBalance()}
                    {this.renderCredit()}
                    {this.renderBottomSelection()}
                    {this.renderLogout()}
                </View>
            </ScrollView>
        );
    }

    async logout() {
        const { logout, navigation } = this.props;
        await Storage.removeData(Constants.KEY_ACCESS_TOKEN);
        await Storage.removeData(Constants.KEY_USER);
        logout();
        setTimeout(() => {
            navigation.navigate('AuthStack');
        }, 300);
    }

    getProfileDataFromProps() {
        const { profile, getProfile } = this.props;

        Utils.invokeIfDataIsNull(profile, () => getProfile());
    }

    getDebtDataFromProps() {
        const { fetchCurrentDept, fetchDeptList } = this.props;
        fetchCurrentDept();
        fetchDeptList();
    }

    getHouseListFromProps() {
        const { houseList, fetchHouseList } = this.props;
        Utils.invokeIfDataIsEmpty(houseList, fetchHouseList);
    }
}
