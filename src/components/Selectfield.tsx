import React from "react";

type Props = {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
};

const SelectField = ({ label, name, value, onChange, options }: Props) => (
    <div className="mb-4">
        <label htmlFor={name} className="block mb-2 font-medium text-gray-700">
            {label}
        </label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((option, idx) => (
                <option key={idx} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);

export default SelectField;
