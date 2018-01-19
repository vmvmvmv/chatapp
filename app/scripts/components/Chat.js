import React from 'react'
import { connect } from 'react-redux'
import io from 'socket.io-client'
import moment from 'moment'
import $ from 'jquery'

import InputField from './InputField'
import { mapStateToProps } from '../utils'
import { addMessage, updateUserList } from '../actions'

const mapDispatchToProps = (dispatch) => {
    return {
        addMsg: (msg) => dispatch(addMessage(msg)),
        updateUserList: (user) => dispatch(updateUserList(user))
    }
};

const MessageHistory = (props) => {
    return (
        <ol id="messages" className="chat__messages">
            {props.data.map((item, index) => {
                return (
                    <div key={index}>
                        <div className="msg">
                            <div className="user-name">
                                {item.from} {item.createdAt}
                            </div>
                            <div>
                                {item.coords ? 
                                    <a 
                                        target='_blank' 
                                        href={`https://www.google.com/maps?q=${item.coords.lat},${item.coords.lng}`}
                                    >Check my location</a>
                                    : 
                                    item.text}
                            </div>
                        </div>
                    </div>
                )
            })}
        </ol>
    )
};

const UsersInRoom = (props) => {
    return (
        <div id="users">
            <ol>
                {
                    props.users.map((usr, index) => {
                        return (
                            <li key={index}>{usr}</li>
                        )
                    })
                }
            </ol>
        </div>
    )
};

class Chat extends React.Component {
    constructor(props) {
        super(props)
        if(!this.props.state.userName) return window.location.href = '/';

        this.socket = io('localhost:5000');
        this.sendMessage = this.sendMessage.bind(this);
        this.onTyping = this.onTyping.bind(this);
        this.sendLocation = this.sendLocation.bind(this);
        

        this.socket.on('UPDATE_USER_LIST', (data) => {
            this.props.updateUserList(data);
        });

        this.socket.on('RECEIVE_MESSAGE', (data) => {
            this.props.addMsg({from: data.from, text: data.text, at: data.at});
        });

        this.socket.on('RECEIVE_LOCATION', (data) => {
            this.props.addMsg({
                from: data.from,
                text: 'My location',
                at: data.at,
                coords: { lat: data.lat, lng: data.lng }
            })
        });

        this.socket.on('SHOW_TYPING', (data) => {
            if (this.props.state.userName !== data.user.name) {
                $('#typing').fadeIn({
                    duration: 1500,
                    start: function() {
                        $(this).text(data.text);
                    },
                    done: function () {
                        $(this).fadeOut();
                    }
                });
            }
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
    };

    componentDidMount() {
        this.msgInput.focus();
    };

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
    };

    sendLocation() {
        if (!navigator.geolocation) return alert('GEO not supported by your browser');

        navigator.geolocation.getCurrentPosition((position) => {
            this.socket.emit('SEND_LOCATION', {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        }, () => {
            alert('Unable to fetch location');
        });
    }

    onTyping() {
        this.socket.emit('USER_IS_TYPING', `${this.props.state.userName} is typing...`);
    }

    render() {
        return (
            <div className='chat'>
                <div className="chat__sidebar">
                    <h3>Users in room {this.props.state.room}:</h3>
                    <UsersInRoom users={this.props.state.usersInRoom} />
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
                        <button id="send-location" onClick={this.sendLocation}>Send location</button>
                    </div>
                </div>
            </div>
        )
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);