import classNames from "classnames";
import type { ComponentProps } from "react";
import { forwardRef } from "react";

export interface ButtonProps extends ComponentProps<"button"> {
  loading?: boolean;
}

// a basic sketch of the kind of button I usually re-invent (with a loading prop).
// in real apps I usually build out a more integrated form system where the button
// would automatically inherit submission state and validation state from the parent form.
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, disabled, loading, children, ...rest }, ref) {
    return (
      <button
        className={classNames(
          "bg-white border border-solid border-black px-4 py-2 rounded-md shadow-md flex flex-row items-center justify-between gap-4",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        )}
        ref={ref}
        disabled={loading || disabled}
        {...rest}
      >
        {loading ? "Loading..." : children}
      </button>
    );
  }
);
