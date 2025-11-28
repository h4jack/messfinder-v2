import { InputField, Dropdown } from "../ui";

const MessDetails = ({
    messType,
    setMessType,
    totalRooms,
    setTotalRooms,
    totalBeds,
    setTotalBeds,
    totalCRooms,
    setTotalCRooms,
    totalBathrooms,
    setTotalBathrooms,
    canteenAvailability,
    setCanteenAvailability,
    totalFloors,
    setTotalFloors,
}) => {
    return (
        <div>
            <Dropdown
                label="Mess Type"
                value={messType}
                onChange={(e) => setMessType(e.target.value)}
                options={[
                    { value: "pg_hostel", label: "PG/Hostel" },
                    { value: "home", label: "Home" },
                ]}
                required
            />
            {messType === "pg_hostel" && (
                <div className="space-y-4">
                    <InputField
                        label="Total Rooms"
                        type="number"
                        placeholder="Enter total rooms"
                        value={totalRooms}
                        onChange={(e) => setTotalRooms(Number(e.target.value))}
                        required
                    />
                    <InputField
                        label="Total Beds"
                        type="number"
                        placeholder="Enter total beds"
                        value={totalBeds}
                        onChange={(e) => setTotalBeds(Number(e.target.value))}
                        required
                    />
                    <InputField
                        label="Total Common Rooms"
                        type="number"
                        placeholder="Enter total common rooms"
                        value={totalCRooms}
                        onChange={(e) => setTotalCRooms(Number(e.target.value))}
                        required
                    />
                    <InputField
                        label="Total Bathrooms"
                        type="number"
                        placeholder="Enter total bathrooms"
                        value={totalBathrooms}
                        onChange={(e) => setTotalBathrooms(Number(e.target.value))}
                        required
                    />
                    <Dropdown
                        label="Canteen Availability"
                        value={canteenAvailability}
                        onChange={(e) => setCanteenAvailability(e.target.value)}
                        options={[
                            { value: "Self", label: "Self" },
                            { value: "Near", label: "Near" },
                            { value: "Far", label: "Far" },
                            { value: "Door Delivery", label: "Door Delivery" },
                        ]}
                        required
                    />
                    <InputField
                        label="Number of Floors"
                        type="number"
                        placeholder="Enter number of floors"
                        value={totalFloors}
                        onChange={(e) => setTotalFloors(Number(e.target.value))}
                        required
                    />
                </div>
            )}
        </div>
    );
};

export default MessDetails;
