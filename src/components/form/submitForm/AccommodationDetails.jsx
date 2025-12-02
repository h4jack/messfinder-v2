import React from 'react';
import { InputField, Dropdown } from "../ui";

const AccommodationDetails = ({ 
    accommodationFor,
    suitableFor,
    price,
    shared,
    setAccommodationFor,
    setSuitableFor,
    setPrice,
    setShared
}) => {
    return (
        <div>
            <div className="flex flex-col gap-2 sm:flex-row">
                <Dropdown
                    label="Accommodation For"
                    options={[
                        { value: "both", label: "Both" },
                        { value: "boys", label: "Boys" },
                        { value: "girls", label: "Girls" },
                    ]}
                    value={accommodationFor}
                    onChange={(e) => setAccommodationFor(e.target.value)}
                    required
                />
                <Dropdown
                    label="Suitable For"
                    options={[
                        { value: "both", label: "Both" },
                        { value: "students", label: "Students" },
                        { value: "working", label: "Working Professionals" },
                    ]}
                    value={suitableFor}
                    onChange={(e) => setSuitableFor(e.target.value)}
                    required
                />
            </div>
            <InputField
                label="Price (₹/month)"
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
            />
            <div>
                <label className="block font-medium mb-1">Shared</label>
                <div className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="shared"
                        value="0"
                        checked={shared === 0}
                        onChange={() => setShared(0)}
                        required
                    />
                    <span>No</span>
                    <input
                        type="radio"
                        name="shared"
                        value="1"
                        checked={shared === 1}
                        onChange={() => setShared(1)}
                        required
                    />
                    <span>1 Person</span>
                    <input
                        type="radio"
                        name="shared"
                        value="2"
                        checked={shared === 2}
                        onChange={() => setShared(2)}
                        required
                    />
                    <span>2 People</span>
                </div>
                {shared > 0 && (
                    <InputField
                        type="number"
                        placeholder="Number of people per room"
                        value={shared}
                        onChange={(e) => setShared(Number(e.target.value))}
                        required
                    />
                )}
            </div>
        </div>
    );
};

export default AccommodationDetails;
