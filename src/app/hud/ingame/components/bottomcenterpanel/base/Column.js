const Column = ({ data, renderCell, label }) => {
  return (
    <div className="flex-1 flex flex-col relative">

      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex-1 flex items-center px-1 overflow-hidden border-b border-gray-800"
        >
          {renderCell
            ? renderCell(i)
            : (
              <span className="text-white text-[10px] truncate">
                {data?.[i]}
              </span>
            )
          }
        </div>
      ))}

      {label && (
        <span className="absolute top-1 left-1 text-[10px] text-white">
          {label}
        </span>
      )}

    </div>
  );
};

export default Column;