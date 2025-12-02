// Button Component
const Button = ({ text, onClick, className }) => {
    return (
        <button
            className={`w-full py-2 rounded-lg transition duration-200 ${className} cursor-pointer`}
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export default Button;