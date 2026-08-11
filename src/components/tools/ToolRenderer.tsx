import { CalcTool, ConvertTool, GradesTool, TextTool } from "./BasicTools";
import { ImageTool, PdfTool, QrTool, ShortenerTool } from "./FileTools";
import type { Tool } from "@/data/types";

/** Maps a registry engine to its interface. Adding a tool never touches the layout. */
export function ToolRenderer({ tool }: { tool: Tool }) {
  const engine = tool.engine;
  switch (engine.kind) {
    case "calc":
      return <CalcTool tool={tool} fields={engine.fields} compute={engine.compute} />;
    case "grades":
      return <GradesTool tool={tool} variant={engine.variant} />;
    case "convert":
      return (
        <ConvertTool
          tool={tool}
          units={engine.units}
          special={engine.special}
          defaultFrom={engine.defaultFrom}
          defaultTo={engine.defaultTo}
        />
      );
    case "text":
      return <TextTool tool={tool} mode={engine.mode} />;
    case "image":
      return <ImageTool tool={tool} mode={engine.mode} to={engine.to} />;
    case "pdf":
      return <PdfTool tool={tool} mode={engine.mode} />;
    case "qr":
      return <QrTool tool={tool} />;
    case "shortener":
      return <ShortenerTool tool={tool} />;
  }
}
