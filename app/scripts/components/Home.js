import React from 'react'
import { connect } from 'react-redux'

import InputField from './InputField'
import { mapStateToProps } from '../utils'
import { loginSuccess } from '../actions'

const mapDispatchToProps = (dispatch) => {
    return {
        loginUser: (params) => dispatch(loginSuccess(params))
    }
};

class Home extends React.Component {
    constructor(props) {
        super(props)

        this.params = {
            name: '',
            room: ''
        };

        this.onChange = this.onChange.bind(this);
        this.loginUser = this.loginUser.bind(this);
    }

    componentDidMount() {
        this.nameInput.focus();
    }

    onChange(e) {
        this.params[e.target.name] = e.target.value;
    }

    loginUser(e) {
        e.preventDefault();
        if(!this.params.name && !this.params.room) return alert('need to fill name & room');
        this.props.loginUser(this.params);
        this.props.history.push('/chat');
    }

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
                            <datalist id='rooms'></datalist>
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