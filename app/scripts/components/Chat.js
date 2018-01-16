import React from 'react'
import { connect } from 'react-redux'
import io from 'socket.io-client'
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
        this.onTyping = this.onTyping.bind(this);
        
        this.socket = io('localhost:5000');

        this.socket.on('RECEIVE_MESSAGE', (data) => {
            console.log(data)
            this.props.addMsg({from: data.from, text: data.text, at: data.at})
        });

        this.socket.on('SHOW_TYPING', (data) => {
            console.log(`${data.user} typing...`)
        });

        this.socket.emit('JOIN_USER', {
            name: this.props.state.userName,
            room: this.props.state.room
        }, (msg) => {
            if(msg) {
                alert(msg);
                return window.location.href = '/';
            }
        });
    }

    componentDidMount() {
        this.msgInput.focus();
    }

    sendMessage(e) {
        e.preventDefault();
        if(!this.msgInput.value) return;

        this.socket.emit('SEND_MESSAGE', {
            from: this.props.state.userName,
            room: this.props.state.room,
            text: this.msgInput.value,
            at: moment().format('kk:mm:ss')
        });

        this.msgInput.value = '';
    }

    onTyping() {
        this.socket.emit('USER_IS_TYPING', `${this.props.state.userName} is typing...`)
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
                                onChange={this.onTyping}
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