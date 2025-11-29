export const DropdownItem = (
    item: string,
    onClick: () => void,
    extraProps?: React.HTMLAttributes<HTMLDivElement | undefined>
) => (
    <div
        key={item || 'empty'}
        className="px-4 py-4 cursor-pointer whitespace-nowrap"
        onClick={(e) => {
            e.preventDefault(); // prevent input blur
            onClick();
        }}
        {...extraProps}
    >
        {item || "Select"}
    </div>
);