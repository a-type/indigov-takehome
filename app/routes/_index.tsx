import { Constituent } from "@prisma/client";
import {
  ActionArgs,
  V2_MetaFunction,
  json,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
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
    await loadConstituentsFromFile(fileContent);
  } else {
    // TODO: error handling / validation
  }

  return json({ ok: true });
}

export async function loader() {
  return json(await getConstituents());
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  // just hacking at simple dynamic table columns for now
  const columns = Object.keys(data[0] ?? {}) as (keyof Constituent)[];

  return (
    <main className="relative min-h-screen bg-white flex flex-col">
      <h1>Constituent Relationship Manager</h1>
      <p>Number of constituents: {data.length}</p>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
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
          Upload constituent data
        </button>
      </Form>
    </main>
  );
}
