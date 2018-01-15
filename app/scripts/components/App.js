import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Async from 'react-code-splitting'

import Home from './Home'
const Chat = () => <Async load={import('./Chat')} />

export default class App extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/chat" component={Chat} />
                </Switch>
            </Router>
        )
    }
}