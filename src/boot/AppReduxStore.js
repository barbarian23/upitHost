import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from '../reducers';
import rootSaga from '../services/sagas';

export default function configurationStore(onCompletion: () => void): any {
    const saga = createSagaMiddleware();
    const enhancer = composeWithDevTools(applyMiddleware(thunk, logger, saga));

    const store = createStore(reducers, enhancer);
    saga.run(rootSaga);
    return store;
}
