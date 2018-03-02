import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import App from './examples/reday-counter';
//import App from './examples/reday-router';
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
