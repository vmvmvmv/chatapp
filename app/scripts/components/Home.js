import React from 'react'
import InputField from './InputField'

export default class Home extends React.Component {
    constructor() {
        super()
        
    }

    componentDidMount() {
        this.nameInput.focus()
    }

    onChange(e) {
        
    }

    render () {
        return (
            <div className='centered-form'>
                <div className='centered-form__form'>
                    <form action='/chat'>
                        <div className='form-field'>
                            <h3>Join</h3>
                        </div>
                        <div className='form-field'>
                            <InputField 
                                fieldName='name'
                                label='Display name'
                                rf={(input) => { this.nameInput = input; }}
                            />
                        </div>
                        <div className='form-field' id='room-select'>
                            <InputField 
                                fieldName='room'
                                label='Room name'
                                list='rooms'
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
}