import React from 'react';
import ReactDOM from 'react-dom';

//redux
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers'

//redux-persist
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/lib/integration/react";

//components
import App from './containers/App';

//css
import './css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const middleware = [ thunk ]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const store = createStore(
  persistReducer(
    {
      key: "root",
      debug: true,
      storage,
      whitelist: ["userState"],
    },
    rootReducer
  ),
  undefined,
  applyMiddleware(...middleware)
);

const persistor = persistStore(store, null, () => {
  // if you want to get restoredState
  console.log("restoredState", store.getState());
});


ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
