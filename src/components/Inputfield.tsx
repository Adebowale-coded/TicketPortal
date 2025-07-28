import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement>{
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
};

const InputField = ({ label, name, value, onChange, type = "text", placeholder, ...props }: Props) => (
    <div className="mb-4">
        <label htmlFor={name} className="block mb-2 font-medium text-gray-700">
            {label}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            
            {...props}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
    </div>
);

export default InputField;
