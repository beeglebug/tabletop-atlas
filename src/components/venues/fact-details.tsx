import type { Fact } from "@/content/types";
import { formatDate } from "@/lib/discovery";

export function FactDetails({ fact }: { fact: Fact<unknown> }) {
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
    </span>
  );
}

export function factText(fact: Fact<boolean>) {
  if (fact.status === "unknown")
    return fact.reason === "conflicting-evidence"
      ? "Sources differ"
      : "Not checked";

  return fact.value ? "Available" : "Not available";
}
