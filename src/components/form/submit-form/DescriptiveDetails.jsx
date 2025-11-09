import { InputField } from "../ui"; // Assuming InputField is a reusable component

const DescriptiveDetails = ({ ...props }) => {
    return (
        <>
            <InputField
                label="Facilities"
                name="facilities"
                placeholder="List facilities (one per line):
AC
Fridge
Cooler"
                type="textarea"
                rows="4"
                value={props.facilities?.replace(/\\n/g, "\n")}
                {...props}
            />
            <InputField
                label="Services"
                name="services"
                placeholder="List services (one per line)
Security Guard
Home Cleaner
"
                type="textarea"
                rows="4"
                value={props.services?.replace(/\\n/g, "\n")}
                {...props}
            />
            <InputField
                label="Rules"
                name="rules"
                placeholder="List rules (one per line)
No Entry after 10pm
No Smocking
No Drinking"
                type="textarea"
                rows="4"
                value={props.rules?.replace(/\\n/g, "\n")}
                {...props}
            />
            <InputField
                label="Description"
                name="description"
                placeholder="Write detailed description of your Mess or Hostel, include any extra information, if you want.."
                type="textarea"
                rows="6"
                value={props.description?.replace(/\\n/g, "\n")}
                {...props}
            />
        </>
    )
}

export default DescriptiveDetails;