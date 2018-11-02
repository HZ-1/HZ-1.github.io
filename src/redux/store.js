import {createStore,combineReducers} from 'redux';
import {newdux} from './reducer';
import {reduxTwo} from './reducer2';

//方式一：
export const store = createStore(combineReducers({newdux,reduxTwo}));
//方式二：
// export const store = createStore(newdux);
