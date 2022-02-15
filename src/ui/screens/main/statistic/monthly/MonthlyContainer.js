import { connect } from 'react-redux';
import { Constants, Utils } from '../../../../../commons';
import StatisticScreen from '../common/statistic';
import { getMonthlyStat } from '../statAction';
import moment from 'moment';
import Strings from '../../../../../utils/LocalizationConfig';

const mapStateToProps = (state) => {
    const { totalAmount, data, dataDescription, loading, number } = state.statReducer.monthly;
    return {
        type: Constants.MONTHLY,
        data,
        dataDescription,
        loading,
        totalAmount,
        currentPage: number,
        queryStartAndEndTime: (position) => {
            const title = dataDescription[position];
            let monthSplit = title.split('/');
            let timeStart = moment([monthSplit[1], parseInt(monthSplit[0], 10) - 1]);
            let timeEnd = moment(timeStart).endOf('month');
            return {
                time_begin: `${timeStart.format(Constants.EDIT_DATE_FORMAT)} 00:00`,
                time_end: `${timeEnd.format(Constants.EDIT_DATE_FORMAT)} 23:59`,
            };
        },
        timeTitle: (position) => {
            const title = dataDescription[position];
            return Utils.capitalizeFirstLetter(
                moment(title, 'MM/YYYY').locale((Strings('language'))).format('MMMM, YYYY'),
            );
        },
    };
};

const mapDispatchToProps = (dispatch) => ({
    fetchStat: (params) => dispatch(getMonthlyStat(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StatisticScreen);
