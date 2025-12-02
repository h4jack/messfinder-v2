const Loader = ({ text = "Loading" }) => {
    return (
        <div className="flex flex-col items-center justify-center mx-auto">
            <div className="relative w-24 h-24 mb-4">
                {/* Spinner border */}
                <div className="absolute inset-0 rounded-full border-4 border-gray-300 border-t-blue-500 animate-spin" />

                {/* Center avatar */}
                <img
                    src="/logo.svg"
                    alt="Loading avatar"
                    className="w-full h-full rounded-full object-cover"
                />
            </div>
            <p className="text-gray-600 text-lg text-center font-medium">{text}</p>
        </div>
    );
}

export default Loader;