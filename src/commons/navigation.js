import { NavigationActions } from 'react-navigation';

let _navigator;

export function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

export function navigate(routeName, params) {
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        }),
    );
}

// add other navigation functions that you need and export them
export function goBack(key) {
    _navigator.dispatch(
        NavigationActions.back({
            key,
        }),
    );
}

export function getCurrentRoute(nav) {
    if (Array.isArray(nav.routes) && nav.routes.length > 0) {
        return getCurrentRoute(nav.routes[nav.index]);
    } else {
        return nav.routeName;
    }
};

export function detailRouteName({ trip_type }) {
    return (trip_type === 'CR') ? 'CRRideDetail' : 'UPRideDetail';
}
