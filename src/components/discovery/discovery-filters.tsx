import {
  filters,
  productLabels,
  serviceLabels,
  type Filter,
} from "@/lib/discovery";

export function DiscoveryFilters({
  activeFilters,
  onToggle,
  onClear,
}: {
  activeFilters: readonly Filter[];
  onToggle: (filter: Filter) => void;
  onClear: () => void;
}) {
  return (
    <fieldset className="filters">
      <legend>What are you looking for?</legend>
      {filters.map((tag) => (
        <label
          key={tag}
          className={`filter-chip ${activeFilters.includes(tag) ? "is-active" : ""}`}
        >
          <input
            type="checkbox"
            checked={activeFilters.includes(tag)}
            onChange={() => onToggle(tag)}
          />
          {tag in productLabels
            ? productLabels[tag as keyof typeof productLabels]
            : serviceLabels[tag as keyof typeof serviceLabels]}
        </label>
      ))}
      <button className="clear-button" onClick={onClear}>
        Clear all
      </button>
    </fieldset>
  );
}
