"use client";

import type { ListContentProps } from "./types";

const ListContent = ({ children }: ListContentProps) => {
  return <div className="flex h-full min-h-0 flex-col">{children}</div>;
};

export default ListContent;
