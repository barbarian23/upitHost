import { connect } from 'react-redux';
import StatusList from '../list';
import { fetchBooking } from '../statusActions';
import { Constants } from '../../../../../commons';

const mapStateToProps = (state) => ({
    type: Constants.STATUS_BOOKING,
    isLoading: state.statusReducer.booking.loading,
    data: state.statusReducer.booking.filterData,
});

const mapDispatchToProps = (dispatch) => ({
    onFetchData: () => {
        dispatch(fetchBooking());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(StatusList);
