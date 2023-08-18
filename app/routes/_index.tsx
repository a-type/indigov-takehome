import { Constituent } from "@prisma/client";
import {
  ActionArgs,
  V2_MetaFunction,
  json,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { Toast } from "~/components/Toast";
import {
  getConstituents,
  loadConstituentsFromFile,
} from "~/models/constituent.server";

export const meta: V2_MetaFunction = () => [
  { title: "Constituent Relationship Manager" },
];

export async function action({ request }: ActionArgs) {
  const uploadHandler = unstable_createMemoryUploadHandler();
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );
  const file = formData.get("file");
  if (file && file instanceof Blob) {
    const fileContent = await file.text();
    try {
      await loadConstituentsFromFile(fileContent);
    } catch (err) {
      console.error(err);
      let message = "An unknown error occurred. Try resubmitting.";
      if (err instanceof Error) {
        // ok, normally you don't want to just toss internal error messages to users,
        // but building out user-facing error patterns is a bit out of scope here.
        message = err.message;
      }
      return json({ ok: false, message });
    }
  } else {
    // this is just a sketch of more effective validation...
    return json({ ok: false, message: "Please upload a CSV file." });
  }

  return json({ ok: true, message: "Constituents loaded successfully." });
}

export async function loader() {
  return json(await getConstituents());
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  // just hacking at simple dynamic table columns for now
  const columns = Object.keys(data[0] ?? {}) as (keyof Constituent)[];

  const uploadResult = useActionData<typeof action>();

  const submissionState = useNavigation();

  return (
    <main className="relative min-h-screen bg-white flex flex-col">
      <h1 className="text-xl mb-4">Constituent Relationship Manager</h1>
      <p className="mb-2">Number of constituents: {data.length}</p>
      <table className="border-collapse border border-solid border-black">
        <thead>
          <tr>
            {columns.map((column) => (
              <th className="text-left" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="odd:bg-slate-50">
              {columns.map((column) => (
                <td key={column}>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Form
        method="post"
        encType="multipart/form-data"
        className="sticky bottom-0 bg-white p-2 w-100% flex flex-row items-center justify-end"
      >
        <input type="file" accept=".csv" name="file" />
        <button type="submit" className="bg-blue-400 px-4 py-1 rounded">
          {submissionState.state === "submitting"
            ? "Loading..."
            : "Upload constituent data"}
        </button>
      </Form>

      <Toast
        open={!!uploadResult}
        variant={uploadResult?.ok ? "success" : "error"}
      >
        {uploadResult?.message ||
          "An unknown error occurred. Try resubmitting."}
      </Toast>
    </main>
  );
}
