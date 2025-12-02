// Reusable Dropdown Component
const Dropdown = ({ label, options, required, ...props }) => (
    <div className="mb-4 w-full">
        <label className="block text-gray-700 font-medium mb-2">{label}</label>
        <select
            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={required}
            {...props}
        >
            <option value="">{`Select ${label}`}</option>
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

export default Dropdown;