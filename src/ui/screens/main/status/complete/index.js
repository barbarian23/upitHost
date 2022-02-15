import { connect } from 'react-redux';
import StatusList from '../list';
import { fetchCompleted } from '../statusActions';
import { Constants } from '../../../../../commons';

const mapStateToProps = (state) => ({
    type: Constants.STATUS_COMPLETE,
    isLoading: state.statusReducer.complete.loading,
    data: state.statusReducer.complete.filterData,
});

const mapDispatchToProps = (dispatch) => ({
    onFetchData: () => {
        dispatch(fetchCompleted());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(StatusList);
