import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import store from './scripts/store'
import App from './scripts/components/App'
import './styles/styles.css'

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
)