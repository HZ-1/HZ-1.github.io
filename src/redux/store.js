import {createStore,combineReducers} from 'redux';
import {addRedux} from './addReducer';
import {tyyReducer} from './tyyReducer';

//方式一：
export const store = createStore(combineReducers({addRedux,tyyReducer}));
//方式二：
// export const store = createStore(newdux);
