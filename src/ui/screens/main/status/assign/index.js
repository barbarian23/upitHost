import { connect } from 'react-redux';
import StatusList from '../list';
import { fetchAssign } from '../statusActions';
import { Constants } from '../../../../../commons';

const mapStateToProps = (state) => ({
    type: Constants.STATUS_CONFIRM,
    isLoading: state.statusReducer.assign.loading,
    data: state.statusReducer.assign.filterData,
});

const mapDispatchToProps = (dispatch) => ({
    onFetchData: () => {
        dispatch(fetchAssign());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(StatusList);
