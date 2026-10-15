import type { Fact } from "@/content/types";
import { formatDate } from "@/lib/discovery";

export function FactDetails({
  fact,
  demo = false,
}: {
  fact: Fact<unknown>;
  demo?: boolean;
}) {
  return (
    <span className="fact-evidence">
      {fact.status === "known" && fact.confirmedOn && (
        <span>
          Evidence dated{" "}
          <time dateTime={fact.confirmedOn}>
            {formatDate(fact.confirmedOn)}
          </time>
          .{" "}
        </span>
      )}
      {fact.evidenceIds.map((id, index) => (
        <a key={id} href={`#source-${id}`}>
          Source {index + 1}
          <span className="sr-only">: {id}</span>
        </a>
      ))}
      {demo && fact.status === "known" && "Illustrative demo fact"}
    </span>
  );
}

export function factText(fact: Fact<boolean>, demo: boolean) {
  if (fact.status === "unknown")
    return fact.reason === "conflicting-evidence"
      ? "Sources differ"
      : "Not checked";

  return `${fact.value ? "Available" : "Not available"}${demo ? " (demo)" : ""}`;
}
