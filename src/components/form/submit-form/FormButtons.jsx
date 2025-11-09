import { Button } from "../ui"; // Assuming Button is a reusable component

const FormButtons = ({ onDelete, onDraft, onSubmit }) => {
    return (
        <div className="flex justify-between gap-3">
            {onDelete &&
                <Button
                    text="Delete"
                    className="sm:max-w-1/4 bg-red-500 text-white"
                    onClick={onDelete}
                    type="button"
                />
            }
            <Button
                text="Draft"
                className="sm:max-w-1/4 bg-yellow-500 text-white"
                onClick={onDraft}
                type="button"
            />
            <Button
                text="Submit"
                className="sm:max-w-1/4 bg-blue-500 text-white"
                type="button"
                onClick={onSubmit}
            />
        </div>
    );
};

export default FormButtons;
