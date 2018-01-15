import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import InputField from './InputField'
import { mapStateToProps } from '../utils'
import { addMessage } from '../actions'

const mapDispatchToProps = (dispatch) => {
    return {
        addMsg: (msg) => dispatch(addMessage(msg))
    }
};

const MessageHistory = (props) => {
    return (
        <ol id="messages" className="chat__messages">
            {
                props.data.map((item, index) => {
                    return (
                        <div className="msg" key={index}>
                            <div className="user-name">{item.from} {item.createdAt}</div>
                            <div>{item.text}</div>
                        </div>
                    )
                })
            }
        </ol>
    )
};

class Chat extends React.Component {
    constructor(props) {
        super(props)
        if(!this.props.state.userName) return window.location.href = '/';

        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidMount() {
        this.msgInput.focus();
    }

    sendMessage(e) {
        e.preventDefault();
        if(!this.msgInput.value) return;
        this.props.addMsg({text: this.msgInput.value, at: moment().format('kk:mm:ss')})
        this.msgInput.value = '';
    }

    render() {
        return (
            <div className='chat'>
                <div className="chat__sidebar">
                    <h3>Users:</h3>
                    <div id="users"></div>
                </div>
                <div className="chat__main">
                    <MessageHistory data={this.props.state.roomMessages} />
                    <div className="chat__footer">
                        <div id="typing"></div>
                        <form id="message-form" onSubmit={this.sendMessage}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Chat);