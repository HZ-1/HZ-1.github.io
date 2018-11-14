import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {store} from './redux/store';
import { Provider } from '../node_modules/react-redux/lib';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>, document.getElementById('root'));
registerServiceWorker();
