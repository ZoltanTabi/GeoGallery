import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './index';

const middleWare = applyMiddleware(thunk);
const store = createStore(rootReducer, middleWare);

export default store;
