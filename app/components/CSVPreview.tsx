import { useEffect, useState } from "react";

export interface CSVPreviewProps {
  file: File;
}

export function CSVPreview({ file }: CSVPreviewProps) {
  const [preview, setPreview] = useState<{ [key: string]: string }[] | null>(
    null
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const csv = import("csv-parse/browser/esm");
    const reader = new FileReader();
    reader.addEventListener("load", async () => {
      const text = reader.result;
      if (typeof text === "string") {
        // FIXME: centralize this parsing logic with the backend version;
        // this requires a bit more effort since the library I grabbed
        // has different package entry points for browser/node. I'd
        // probably look for something else that's isomorphic.
        (await csv).parse(
          text,
          {
            columns: true,
            skip_empty_lines: true,
          },
          (err, data) => {
            if (err) {
              setError(err);
            } else {
              setPreview(data);
            }
          }
        );
      }
    });
    reader.readAsText(file);
  }, [file]);

  if (!preview) {
    return null;
  }

  if (error) {
    return <p className="text-red-800">{error.message}</p>;
  }

  return (
    <div className="overflow-auto border border-solid border-black">
      <table>
        <thead>
          <tr>
            {Object.keys(preview[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {preview.map((record) => (
            <tr key={record.email}>
              {Object.values(record).map((value) => (
                <td key={value}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
