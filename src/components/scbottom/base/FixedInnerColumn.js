import React from "react";

const FixedInnerColumn = ({
  width = "w-[65px]",
  renderCell,
}) => {
  return (
    <div className={`${width} flex flex-col relative h-full `}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex-1 flex items-center justify-center"
        >
          {renderCell ? renderCell(i) : null}
        </div>
      ))}

    </div>
  );
};

export default FixedInnerColumn;