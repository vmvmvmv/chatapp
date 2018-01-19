import React from 'react'

const InputField =({fieldName, placeHolder, value, type, label, onChange, list, rf}) => {
    return (
        <div className='form-field'>
            <label className='form-label'>{label}</label>
            <input 
                name={fieldName}
                value={value}
                placeholder={placeHolder}
                type={type}
                onChange={onChange}
                list={list}
                ref={rf}
            />
        </div>
    )
}

InputField.defaultProps = {
    type: 'text',
    placeHolder: ''
}

export default InputField;