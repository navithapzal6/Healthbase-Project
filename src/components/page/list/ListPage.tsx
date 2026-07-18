"use client";

import ListBulkActions from "./ListBulkActions";
import ListContent from "./ListContent";
import ListFilterPanel from "./ListFilterPanel";
import ListToolbar from "./ListToolbar";

import type { ListPageProps, ListToolbarProps } from "./types";

interface Props extends ListPageProps, ListToolbarProps {}

const ListPage = ({
  title,
  children,
  filterContent,
  filterOpen = false,
  filterCount = 0,
  selectedCount = 0,
  showFilter = true,
  showAdd = true,
  addLabel,
  sortOptions,
  sortValue,
  sortDirection,
  onFilter,
  onAdd,
  onSortChange,
  onFilterClose,
  onFilterApply,
  onFilterReset,
  onBulkEdit,
  onBulkDelete,
}: Props) => {
  return (
    <ListContent>
      <ListToolbar
        title={title}
        showFilter={showFilter}
        showAdd={showAdd}
        addLabel={addLabel}
        filterOpen={filterOpen}
        filterCount={filterCount}
        sortOptions={sortOptions}
        sortValue={sortValue}
        sortDirection={sortDirection}
        onFilter={onFilter}
        onAdd={onAdd}
        onSortChange={onSortChange}
      />

      <ListBulkActions
        selectedCount={selectedCount}
        onEdit={onBulkEdit}
        onDelete={onBulkDelete}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-4 md:flex-row">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>

        <ListFilterPanel
          open={filterOpen}
          onClose={onFilterClose}
          onApply={onFilterApply}
          onReset={onFilterReset}
        >
          {filterContent}
        </ListFilterPanel>
      </div>
    </ListContent>
  );
};

export default ListPage;
