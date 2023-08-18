import * as ToastPrimitive from "@radix-ui/react-toast";
import classNames from "classnames";

export interface ToastProps {
  children?: React.ReactNode;
  variant?: "success" | "error";
  className?: string;
  open?: boolean;
}

export function Toast({ children, variant, className, ...rest }: ToastProps) {
  return (
    <ToastPrimitive.Root
      className={classNames(
        "bg-white border border-solid border-black p-4 rounded-md shadow-md flex flex-row items-center justify-between gap-4",
        {
          "bg-green-100 border-green-400 text-green-800": variant === "success",
          "bg-red-100 border-red-400 text-red-800": variant === "error",
        },
        "data-[state=open]:opacity-100",
        "data-[state=closed]:opacity-0",
        className
      )}
      {...rest}
    >
      <ToastPrimitive.Title
        style={{ gridArea: "title" }}
        className="mb-1 font-medium"
      >
        {children}
      </ToastPrimitive.Title>
      <ToastPrimitive.Close>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path
            d="M1 1L12 12M12 1L1 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}
