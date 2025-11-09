import Button from "./button";

const SetRoleBox = ({ setRole }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Role</h2>
            <div className="flex flex-col gap-4">
                <Button
                    text="User"
                    onClick={() => setRole("user")}
                    className="bg-blue-500 text-white hover:bg-blue-600"
                />
                <Button
                    text="Owner"
                    onClick={() => setRole("owner")}
                    className="bg-green-500 text-white hover:bg-green-600"
                />
            </div>
        </div>
    )
}

export default SetRoleBox;