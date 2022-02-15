import { connect } from 'react-redux';
import { Constants, Utils } from '../../../../../commons';
import StatisticScreen from '../common/statistic';
import { getDailyStat } from '../statAction';
import moment from 'moment';
import Strings from '../../../../../utils/LocalizationConfig';

const mapStateToProps = (state) => {
    const { totalAmount, data, dataDescription, loading, number } = state.statReducer.daily;
    return {
        currentPage: number,
        type: Constants.DAILY,
        data,
        dataDescription,
        loading,
        totalAmount,
        queryStartAndEndTime: (position) => {
            const title = dataDescription[position];
            return { time_begin: `${title} 00:00`, time_end: `${title} 23:59` };
        },
        timeTitle: (position) => {
            const title = dataDescription[position];
            return Utils.capitalizeFirstLetter(
                moment(title, 'MM/DD/YYYY').locale((Strings('language'))).format('dddd, MMMM DD, YYYY'),
            );
        },
    };
};

const mapDispatchToProps = (dispatch) => ({
    fetchStat: (params) => dispatch(getDailyStat(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StatisticScreen);
