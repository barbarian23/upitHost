import { connect } from 'react-redux';
import { Constants } from '../../../../../commons';
import StatisticScreen from '../common/statistic';
import { getYearlyStat } from '../statAction';
import moment from 'moment';

const mapStateToProps = (state) => {
    const { totalAmount, data, dataDescription, loading, number } = state.statReducer.yearly;

    return {
        type: Constants.YEARLY,
        currentPage: number,
        data,
        dataDescription,
        loading,
        totalAmount,
        queryStartAndEndTime: (position) => {
            const title = dataDescription[position];
            let timeStart = moment([`${title}`, 0, 1]);
            let timeEnd = moment(timeStart).endOf('year');
            return {
                time_begin: `${timeStart.format(Constants.EDIT_DATE_FORMAT)} 00:00`,
                time_end: `${timeEnd.format(Constants.EDIT_DATE_FORMAT)} 23:59`,
            };
        },
        timeTitle: (position) => {
            const title = dataDescription[position];
            return title;
        },
    };
};

const mapDispatchToProps = (dispatch) => ({
    fetchStat: (params) => dispatch(getYearlyStat(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StatisticScreen);
