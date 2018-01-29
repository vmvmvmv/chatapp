import React from 'react'
import { connect } from 'react-redux'
import io from 'socket.io-client'

import InputField from './InputField'
import { mapStateToProps } from '../utils'
import { loginSuccess, updateRoomList } from '../actions'

const mapDispatchToProps = (dispatch) => {
    return {
        loginUser: (params) => dispatch(loginSuccess(params)),
        updateRooms: (rooms) => dispatch(updateRoomList(rooms))
    }
};

const RoomsSelector = (props) => {
    return (
        <datalist id='rooms'>
            {props.rooms.map((item, index) => {
                return (
                    <option value={item} key={index} />
                )
            })}
        </datalist>
    )
}; 

class Home extends React.Component {
    constructor(props) {
        super(props)

        this.socket = io('https://afternoon-basin-50453.herokuapp.com');
        this.rooms = [];
        this.params = {
            name: '',
            room: ''
        };

        this.socket.on('GET_ROOMS_LIST', (users) => {
            users.forEach((usr) => {
                if(this.rooms.indexOf(usr.room) < 0) {
                    this.rooms.push(usr.room); 
                }
            });

            this.props.updateRooms(this.rooms);
        });
    };

    componentDidMount() {
        this.nameInput.focus();
    };

    onChange = (e) => {
        this.params[e.target.name] = e.target.value;
    };

    loginUser = (e) => {
        e.preventDefault();
        if(!(this.params.name && this.params.room)) return alert('need to fill name & room');
        this.props.loginUser(this.params);
        this.props.history.push('/chat');
    };

    render () {
        return (
            <div className='centered-form'>
                <div className='centered-form__form'>
                    <form onSubmit={this.loginUser}>
                        <div className='form-field'>
                            <h3>Join</h3>
                        </div>
                        <div className='form-field'>
                            <InputField 
                                fieldName='name'
                                label='Display name'
                                rf={(input) => { this.nameInput = input; }}
                                onChange={this.onChange}
                            />
                        </div>
                        <div className='form-field' id='room-select'>
                            <InputField 
                                fieldName='room'
                                label='Room name'
                                list='rooms'
                                onChange={this.onChange}
                            />
                            <RoomsSelector rooms={this.rooms}/>
                        </div>
                        <div className='form-field'>
                            <button>Join</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);