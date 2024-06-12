import React, { ChangeEvent } from 'react';

interface InputProps {
    label: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ label, value, onChange }) => {
    return (
        <div>
            <label>{label}</label>
            <input type="text" value={value} onChange={onChange} />
        </div>
    );
};

export default Input;