import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CalcField, CalcResult, Tool, UnitDef } from "@/data/types";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function ResultPanel({
  label,
  value,
  notes,
  copyValue,
}: {
  label: string;
  value: string;
  notes?: string[] | undefined;
  copyValue?: string | undefined;

}) {
  const [copied, setCopied] = useState(false);
  const text = copyValue ?? value;

  return (
    <div className="rounded-2xl border border-primary/25 bg-primary-soft p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">
            {label}
          </p>
          <p className="mt-1 break-words text-2xl font-bold text-foreground sm:text-3xl">{value}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 bg-card"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            } catch {
              setCopied(false);
            }
          }}
        >
          {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
          <span className="ml-1.5">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      {notes?.length ? (
        <ul className="mt-4 space-y-1.5 border-t border-primary/15 pt-3 text-sm text-muted-foreground">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
      {message}
    </p>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: CalcField;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={field.name}>{field.label}</Label>
      {field.type === "select" ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id={field.name} className="h-12">
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="relative">
          <Input
            id={field.name}
            type={field.type === "date" ? "date" : field.type === "text" ? "text" : "text"}
            inputMode={field.type === "date" || field.type === "text" ? undefined : "decimal"}
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={cn("h-12 text-base", field.suffix && "pr-14")}
          />
          {field.suffix ? (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {field.suffix}
            </span>
          ) : null}
        </div>
      )}
      {field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null}
    </div>
  );
}

/** Input → Action → Result, driven entirely by the tool registry. */
export function CalcTool({
  tool,
  fields,
  compute,
}: {
  tool: Tool;
  fields: CalcField[];
  compute: (v: Record<string, string>) => CalcResult;
}) {
  const initial = useMemo(
    () => Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ?? ""])),
    [fields],
  );
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [result, setResult] = useState<CalcResult | null>(null);

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const next = compute(values);
        setResult(next);
        if (!("error" in next)) track("tool_completed", { tool: tool.slug });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <FieldInput
            key={field.name}
            field={field}
            value={values[field.name] ?? ""}
            onChange={(v) => setValues((prev) => ({ ...prev, [field.name]: v }))}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg" className="min-w-36">
          Calculate
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          onClick={() => {
            setValues(initial);
            setResult(null);
          }}
        >
          Clear
        </Button>
      </div>

      {result ? (
        "error" in result ? (
          <ErrorNote message={result.error} />
        ) : (
          <ResultPanel label={result.label} value={result.value} notes={result.notes} />
        )
      ) : null}
    </form>
  );
}

interface Row {
  id: number;
  score: string;
  weight: string;
}

export function GradesTool({ tool, variant }: { tool: Tool; variant: "gpa" | "cgpa" | "grade" }) {
  const labels =
    variant === "gpa"
      ? { a: "Grade points", b: "Credits", out: "Semester GPA" }
      : variant === "cgpa"
        ? { a: "Semester GPA", b: "Semester credits", out: "Cumulative GPA" }
        : { a: "Score (%)", b: "Weight", out: "Weighted grade" };

  const [rows, setRows] = useState<Row[]>([
    { id: 1, score: "", weight: "" },
    { id: 2, score: "", weight: "" },
    { id: 3, score: "", weight: "" },
  ]);

  const totals = rows.reduce(
    (acc, r) => {
      const s = Number.parseFloat(r.score);
      const w = Number.parseFloat(r.weight);
      if (Number.isFinite(s) && Number.isFinite(w) && w > 0) {
        acc.points += s * w;
        acc.weight += w;
        acc.counted += 1;
      }
      return acc;
    },
    { points: 0, weight: 0, counted: 0 },
  );

  const average = totals.weight > 0 ? totals.points / totals.weight : null;

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="hidden gap-3 sm:grid sm:grid-cols-[1fr_1fr_auto]">
          <Label>{labels.a}</Label>
          <Label>{labels.b}</Label>
          <span className="w-10" />
        </div>
        {rows.map((row, i) => (
          <div key={row.id} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <Input
              aria-label={`${labels.a} row ${i + 1}`}
              inputMode="decimal"
              placeholder={variant === "grade" ? "82" : "4.0"}
              value={row.score}
              className="h-12 text-base"
              onChange={(e) =>
                setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, score: e.target.value } : r)))
              }
            />
            <Input
              aria-label={`${labels.b} row ${i + 1}`}
              inputMode="decimal"
              placeholder={variant === "grade" ? "40" : "3"}
              value={row.weight}
              className="h-12 text-base"
              onChange={(e) =>
                setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, weight: e.target.value } : r)))
              }
            />
            <Button
              type="button"
              variant="ghost"
              className="h-12 text-muted-foreground sm:w-10"
              aria-label={`Remove row ${i + 1}`}
              disabled={rows.length <= 1}
              onClick={() => setRows((prev) => prev.filter((r) => r.id !== row.id))}
            >
              ✕
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setRows((prev) => [...prev, { id: Date.now(), score: "", weight: "" }])}
        >
          Add row
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setRows([{ id: Date.now(), score: "", weight: "" }])}
        >
          Clear
        </Button>
      </div>

      {average === null ? (
        <p className="text-sm text-muted-foreground">
          Enter at least one row with a value and a weight to see your {labels.out.toLowerCase()}.
        </p>
      ) : (
        <ResultPanel
          label={labels.out}
          value={
            variant === "grade"
              ? `${(Math.round(average * 100) / 100).toFixed(2)}%`
              : (Math.round(average * 1000) / 1000).toFixed(2)
          }
          notes={[
            `${totals.counted} row${totals.counted === 1 ? "" : "s"} counted`,
            `Total ${labels.b.toLowerCase()}: ${Math.round(totals.weight * 100) / 100}`,
            variant === "grade" && totals.weight < 100
              ? `${Math.round((100 - totals.weight) * 100) / 100}% of the course is still unmarked.`
              : `Weighted points: ${Math.round(totals.points * 100) / 100}`,
          ]}
        />
      )}
      <input type="hidden" data-tool={tool.slug} />
    </div>
  );
}

const tempTo = (value: number, from: string, to: string) => {
  const celsius = from === "c" ? value : from === "f" ? ((value - 32) * 5) / 9 : value - 273.15;
  return to === "c" ? celsius : to === "f" ? (celsius * 9) / 5 + 32 : celsius + 273.15;
};

export function ConvertTool({
  tool,
  units,
  special,
  defaultFrom,
  defaultTo,
}: {
  tool: Tool;
  units: UnitDef[];
  special?: "temperature" | undefined;
  defaultFrom: string;
  defaultTo: string;
}) {
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);

  const parsed = Number.parseFloat(value.replace(/,/g, ""));
  const fromUnit = units.find((u) => u.id === from) ?? units[0]!;
  const toUnit = units.find((u) => u.id === to) ?? units[1] ?? units[0]!;

  const converted = Number.isFinite(parsed)
    ? special === "temperature"
      ? tempTo(parsed, fromUnit.id, toUnit.id)
      : (parsed * fromUnit.factor) / toUnit.factor
    : null;

  const display =
    converted === null
      ? "—"
      : Math.abs(converted) >= 1e-6 && Math.abs(converted) < 1e15
        ? converted.toLocaleString(undefined, { maximumFractionDigits: 8 })
        : converted.toExponential(6);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="convert-value">Value</Label>
          <Input
            id="convert-value"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-12 text-base"
          />
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger className="h-12" aria-label="Convert from">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {units.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-12 sm:mb-0"
          aria-label="Swap units"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
        >
          ⇄ Swap
        </Button>

        <div className="space-y-1.5">
          <Label htmlFor="convert-result">Result</Label>
          <Input
            id="convert-result"
            readOnly
            value={display}
            className="h-12 bg-muted text-base font-semibold"
          />
          <Select value={to} onValueChange={setTo}>
            <SelectTrigger className="h-12" aria-label="Convert to">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {units.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {converted !== null ? (
        <ResultPanel
          label={`${value} ${fromUnit.label} =`}
          value={`${display} ${toUnit.label}`}
          copyValue={display}
          notes={[
            special === "temperature"
              ? "Temperature scales use an offset as well as a ratio, so conversion is not a single multiplication."
              : `1 ${fromUnit.label} = ${(fromUnit.factor / toUnit.factor).toLocaleString(undefined, { maximumFractionDigits: 8 })} ${toUnit.label}`,
          ]}
        />
      ) : (
        <ErrorNote message="Please enter a number to convert." />
      )}
      <input type="hidden" data-tool={tool.slug} />
    </div>
  );
}

type TextMode = "stats" | "upper" | "lower" | "title" | "case" | "dedupe" | "trim" | "reverse";

const titleCase = (s: string) =>
  s.toLowerCase().replace(/(^|\s)(\p{L})/gu, (_m, sp: string, ch: string) => sp + ch.toUpperCase());

const sentenceCase = (s: string) =>
  s.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (_m, sp: string, ch: string) => sp + ch.toUpperCase());

export function TextTool({ tool, mode }: { tool: Tool; mode: TextMode }) {
  const [text, setText] = useState("");
  const [caseMode, setCaseMode] = useState("upper");
  const [reverseMode, setReverseMode] = useState("chars");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+/g)?.length ?? 1) : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
    return {
      words,
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, "").length,
      sentences,
      paragraphs,
      lines: text ? text.split(/\n/).length : 0,
      readingMinutes: words / 250,
    };
  }, [text]);

  const output = useMemo(() => {
    switch (mode) {
      case "upper":
        return text.toUpperCase();
      case "lower":
        return text.toLowerCase();
      case "title":
        return titleCase(text);
      case "case":
        return caseMode === "upper"
          ? text.toUpperCase()
          : caseMode === "lower"
            ? text.toLowerCase()
            : caseMode === "title"
              ? titleCase(text)
              : caseMode === "sentence"
                ? sentenceCase(text)
                : caseMode === "camel"
                  ? text
                      .toLowerCase()
                      .replace(/[^\p{L}\p{N}]+(\p{L})/gu, (_m, c: string) => c.toUpperCase())
                      .replace(/[^\p{L}\p{N}]/gu, "")
                  : caseMode === "snake"
                    ? text.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "_")
                    : text.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-");
      case "dedupe": {
        const seen = new Set<string>();
        return text
          .split("\n")
          .filter((line) => {
            const key = line.trim().toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })
          .join("\n");
      }
      case "trim":
        return text
          .replace(/\u00a0/g, " ")
          .replace(/[ \t]+/g, " ")
          .replace(/[ \t]+$/gm, "")
          .replace(/^[ \t]+/gm, "")
          .replace(/\n{3,}/g, "\n\n")
          .trim();
      case "reverse":
        return reverseMode === "chars"
          ? [...text].reverse().join("")
          : reverseMode === "words"
            ? text.split(/\s+/).reverse().join(" ")
            : text.split("\n").reverse().join("\n");
      default:
        return text;
    }
  }, [text, mode, caseMode, reverseMode]);

  const removedLines =
    mode === "dedupe" ? text.split("\n").length - output.split("\n").length : 0;

  return (
    <div className="space-y-4">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Words", stats.words],
          ["Characters", stats.characters],
          ["Sentences", stats.sentences],
          ["Paragraphs", stats.paragraphs],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-border bg-surface px-4 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </dt>
            <dd className="text-xl font-bold text-foreground">{Number(value).toLocaleString()}</dd>
          </div>
        ))}
      </dl>

      <div className="space-y-1.5">
        <Label htmlFor="text-input">Your text</Label>
        <Textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here…"
          className="min-h-64 resize-y text-base leading-relaxed"
        />
        <p className="text-xs text-muted-foreground">
          Characters without spaces: {stats.charactersNoSpaces.toLocaleString()} · Lines:{" "}
          {stats.lines.toLocaleString()} · Reading time: ~
          {stats.readingMinutes < 1 ? "<1" : Math.round(stats.readingMinutes)} min
        </p>
      </div>

      {mode === "case" ? (
        <div className="flex flex-wrap gap-2">
          {[
            ["upper", "UPPERCASE"],
            ["lower", "lowercase"],
            ["title", "Title Case"],
            ["sentence", "Sentence case"],
            ["camel", "camelCase"],
            ["snake", "snake_case"],
            ["kebab", "kebab-case"],
          ].map(([id, label]) => (
            <Button
              key={id}
              type="button"
              size="sm"
              variant={caseMode === id ? "default" : "outline"}
              onClick={() => setCaseMode(id!)}
            >
              {label}
            </Button>
          ))}
        </div>
      ) : null}

      {mode === "reverse" ? (
        <div className="flex flex-wrap gap-2">
          {[
            ["chars", "Reverse characters"],
            ["words", "Reverse words"],
            ["lines", "Reverse lines"],
          ].map(([id, label]) => (
            <Button
              key={id}
              type="button"
              size="sm"
              variant={reverseMode === id ? "default" : "outline"}
              onClick={() => setReverseMode(id!)}
            >
              {label}
            </Button>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(mode === "stats" ? text : output);
            track("tool_completed", { tool: tool.slug });
          }}
        >
          Copy {mode === "stats" ? "text" : "result"}
        </Button>
        <Button type="button" variant="outline" onClick={() => setText("")}>
          Clear
        </Button>
      </div>

      {mode !== "stats" ? (
        <div className="space-y-1.5">
          <Label htmlFor="text-output">Result</Label>
          <Textarea
            id="text-output"
            readOnly
            value={output}
            className="min-h-40 bg-muted text-base"
          />
          {mode === "dedupe" ? (
            <p className="text-xs text-muted-foreground">
              {removedLines > 0
                ? `${removedLines.toLocaleString()} duplicate line${removedLines === 1 ? "" : "s"} removed.`
                : "No duplicate lines found."}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
