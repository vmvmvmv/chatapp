import React from 'react'
import InputField from './InputField'

export default class Chat extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        this.msgInput.focus()
    }

    render() {
        return (
            <div className='chat'>
                <div className="chat__sidebar">
                    <h3>Users:</h3>
                    <div id="users"></div>
                </div>
                <div className="chat__main">
                    <ol id="messages" className="chat__messages"></ol>
                    <div className="chat__footer">
                        <div id="typing"></div>
                        <form id="message-form">
                            <InputField
                                name='message'
                                placeHolder='Message'
                                rf={(input) => { this.msgInput = input; }}
                            />
                            <button>Send</button>
                        </form>
                        <button id="send-location">Send location</button>
                    </div>
                </div>
            </div>
        )
    }
}