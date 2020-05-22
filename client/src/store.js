import {createStore,applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

import axios from "axios";
import * as AxiosLogger from "axios-logger";

const initialState={}

const middleware=[thunk];

const store=createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store;



const instance = axios.create();
instance.interceptors.request.use(AxiosLogger.requestLogger);
