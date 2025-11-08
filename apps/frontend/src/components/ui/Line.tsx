import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

// Define reusable variants
const lineVariants = cva("rounded-full block", {
  variants: {
    variant: {
      solid: "bg-gray-300 dark:bg-gray-700",
      faint: "bg-white/10",
      primary:
        "bg-gradient-to-r from-blue-500 to-cyan-400 dark:from-blue-400 dark:to-cyan-300",
      gradient:
        "bg-[linear-gradient(45deg,var(--color-faint-text,#a1a1aa),var(--color-background,#18181b))]",
    },
    orientation: {
      horizontal: "w-20 h-[2px]",
      vertical: "h-20 w-[2px]",
    },
    thickness: {
      xs: "h-[0.1rem]",
      sm: "h-px",
      md: "h-[2px]",
      lg: "h-[3px]",
    },
    length: {
      sm: "w-10",
      md: "w-20",
      lg: "w-32",
      full: "w-full",
    },
  },
  defaultVariants: {
    variant: "gradient",
    orientation: "horizontal",
    thickness: "md",
    length: "md",
  },
});

interface LineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof lineVariants> {
  color1?: string;
  color2?: string;
}

const Line = React.forwardRef<HTMLDivElement, LineProps>(
  (
    {
      className,
      variant,
      orientation,
      thickness,
      length,
      color1,
      color2,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          lineVariants({ variant, orientation, thickness, length, className })
        )}
        style={{
          background:
            color1 && color2
              ? `linear-gradient(45deg, ${color1}, ${color2})`
              : undefined,
        }}
        {...props}
      />
    );
  }
);

Line.displayName = "Line";

export { Line, lineVariants };
