import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Form, useNavigation } from "@remix-run/react";
import classNames from "classnames";
import { useState } from "react";
import { Button } from "~/components/Button";
import { CSVPreview } from "~/components/CSVPreview";

export interface UploadDialogProps {
  className?: string;
}

export interface UploadDialogProps {
  action: string;
}

export function UploadDialog({ action }: UploadDialogProps) {
  const submissionState = useNavigation();
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  // FIXME: these dialog primitives would be extracted into a reusable, generic dialog system
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>
        <Button>Upload CSV</Button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
        <DialogPrimitive.Content
          className={classNames(
            "flex flex-col gap-4",
            "data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
          )}
        >
          <Form
            method="post"
            encType="multipart/form-data"
            className="flex flex-row items-center gap-1"
            action={action}
          >
            {/* FIXME: default-styled file input! */}
            <input
              type="file"
              accept=".csv"
              name="file"
              onChange={(ev) => {
                const file = ev.target.files?.[0] ?? null;
                setPreviewFile(file);
              }}
            />
            <Button
              type="submit"
              loading={submissionState.formAction === action}
            >
              Upload
            </Button>
          </Form>
          {previewFile && <CSVPreview file={previewFile} />}
          <div className="flex flex-row items-center justify-end gap-4">
            <DialogPrimitive.Close asChild>
              <Button>Close</Button>
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
