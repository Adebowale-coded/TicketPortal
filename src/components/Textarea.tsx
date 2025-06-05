import React from "react";

type Props = {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
};

const TextAreaField = ({ label, name, value, onChange, placeholder, rows = 4 }: Props) => (
    <div className="mb-4">
        <label htmlFor={name} className="block mb-2 font-medium text-gray-700">
            {label}
        </label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            required
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
    </div>
);

export default TextAreaField;
