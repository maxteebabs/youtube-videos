import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { Provider} from 'react-redux';
import { createStore }  from 'redux';
import reducers from './redux/reducers/youtube';
// ReactDOM.render(<App />, document.getElementById('root'));
const store = createStore(reducers);
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root'));
registerServiceWorker();
