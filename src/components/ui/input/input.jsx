import { FaEye, FaEyeSlash } from "react-icons/fa";

// InputField Component
const InputField = ({ label, name, type, value, onChange, placeholder, showToggle, toggleVisibility, errorMessage, required, ...props }) => {
    return (
        <div className="mb-4 w-full">
            <label className="block text-gray-700 font-medium mb-2">{label}</label>
            {errorMessage &&
                <span className="text-red-500 text-sm mt-1">{errorMessage}</span>
            }
            <div className={`relative ${errorMessage ? "border-red-500" : ""}`}>
                {type === "textarea" ? (
                    <textarea
                        placeholder={placeholder}
                        name={name}
                        value={value}
                        onChange={onChange}
                        className={`w-full px-4 py-2 border ${errorMessage ? "border-red-500" : "border-gray-400"} rounded-lg focus:outline-none focus:ring-2 ${errorMessage ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
                        required={required}
                        {...props}
                    />
                ) : (
                    <input
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        className={`w-full px-4 py-2 border ${errorMessage ? "border-red-500" : "border-gray-400"} rounded-lg focus:outline-none focus:ring-2 ${errorMessage ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
                        required={required}
                        {...props}
                    />
                )}
                {showToggle && type !== "textarea" && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                        onClick={toggleVisibility}
                    >
                        {type === "text" ? <FaEyeSlash /> : <FaEye />}
                    </button>
                )}
            </div>
        </div>
    );
}

export default InputField;