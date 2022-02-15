import { createActionSet } from '../../../../actions';

export const FETCH_DEPT_LIST = createActionSet('DEPT_LIST');
export const FETCH_CURRENT_DEPT = createActionSet('CURRENT_DEPT');

export const fetchDeptList = () => ({
    type: FETCH_DEPT_LIST.actionName,
});

export const fetchCurrentDept = () => ({
    type: FETCH_CURRENT_DEPT.actionName,
});
