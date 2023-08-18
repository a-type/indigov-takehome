import type { Constituent } from "@prisma/client";
import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import {
  json,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { Toast } from "~/components/Toast";
import { UploadDialog } from "~/components/UploadDialog";
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

// FIXME: this concern doesn't belong here; if there were a centralized constituent
// table component I would probably colocate it there.
const COLUMN_NAMES = {
  id: "id",
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  phoneNumber: "Phone number",
  streetAddress1: "Street address",
  streetAddress2: "Street address (2)",
  city: "City",
  state: "State",
  zipCode: "Zip code",
  createdAt: "Added at",
  updatedAt: "Updated at",
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  // just hacking at simple dynamic table columns for now
  const columns = Object.keys(data[0] ?? {}) as (keyof Constituent)[];

  const uploadResult = useActionData<typeof action>();

  return (
    <main className="relative h-screen bg-white flex flex-col">
      <h1 className="text-xl mb-4">Constituent Relationship Manager</h1>
      <p className="mb-2">Number of constituents: {data.length}</p>
      <div className="overflow-auto flex-1-1-0">
        {/* FIXME: extract this table and the CSV preview table into a centralized display component */}
        <table className="border-collapse border border-solid border-black">
          <thead>
            <tr>
              {columns.map((column) => (
                <th className="text-left p-1 whitespace-nowrap" key={column}>
                  {COLUMN_NAMES[column]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="odd:bg-slate-50">
                {columns.map((column) => (
                  <td key={column} className="p-1">
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex-0-0-auto bg-white p-2 w-100% flex flex-row items-center justify-end">
        {/*

        To be honest I'm a little new to good Remix abstractions for these kinds of things.
        My goal by supporting an "action" prop here is to make this upload dialog reusable across
        different pages. But perhaps you'd architect the app to have a single action for uploads
        which redirects the user back to their previous page, or always lands you on the main
        constituent list.

        This is an example of an initial implementation I might propose and get team feedback on,
        and remain open to refactoring down the line if a more intuitive abstraction emerges.

        */}
        <UploadDialog action="/?index" />
      </div>

      {!!uploadResult && (
        // why a key here? Toast won't unmount if uploadResult changes, so using a key
        // helps reset the visibility of the toast for multiple submissions. this is
        // only a quick fix for this problem; in a real app I'd come up with something
        // more immediately comprehensible.
        <Toast
          key={uploadResult.message}
          variant={uploadResult.ok ? "success" : "error"}
        >
          {uploadResult.message ||
            "An unknown error occurred. Try resubmitting."}
        </Toast>
      )}
    </main>
  );
}
