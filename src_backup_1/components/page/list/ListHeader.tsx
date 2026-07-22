"use client";

import { ListHeaderProps } from "./types";

const ListHeader = ({ title }: ListHeaderProps) => {
  return (
    <div>
      <h1
        className="
        text-xl
        font-semibold
        text-foreground
        "
      >
        {title}
      </h1>
    </div>
  );
};

export default ListHeader;
