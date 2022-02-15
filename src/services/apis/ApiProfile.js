import ApiHelper from './ApiHelper';
import { Constants } from '../../commons';

export const fetchDeptList = () => ApiHelper.get(Constants.GET_DEPT_LIST_PATH);

export const fetchCurrentDept = () => ApiHelper.get(Constants.GET_CURRENT_DEPT);

export const updateProfile = (data) => ApiHelper.post(Constants.EDIT_INFO, data);
