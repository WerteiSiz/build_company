import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "./utils";

interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

function Select({
  value = "",
  onValueChange,
  children,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}) {
  const [internalValue, setInternalValue] = React.useState(value);
  const [open, setOpen] = React.useState(false);
  
  const isControlled = onValueChange !== undefined;
  const currentValue = isControlled ? value : internalValue;
  
  const handleValueChange = React.useCallback((newValue: string) => {
    if (isControlled) {
      onValueChange(newValue);
    } else {
      setInternalValue(newValue);
    }
    setOpen(false);
  }, [isControlled, onValueChange]);

  return (
    <SelectContext.Provider value={{ 
      value: currentValue, 
      onValueChange: handleValueChange,
      open,
      onOpenChange: setOpen
    }}>
      {children}
    </SelectContext.Provider>
  );
}

function SelectTrigger({
  className,
  children,
  placeholder,
  ...props
}: React.ComponentProps<"button"> & {
  placeholder?: string;
}) {
  const context = React.useContext(SelectContext);
  
  if (!context) {
    throw new Error("SelectTrigger must be used within Select");
  }

  return (
    <button
      type="button"
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-input bg-input-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => context.onOpenChange(!context.open)}
      {...props}
    >
      <span className={context.value ? "" : "text-muted-foreground"}>
        {children || placeholder}
      </span>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = React.useContext(SelectContext);
  
  if (!context) {
    throw new Error("SelectValue must be used within Select");
  }

  return <>{context.value || placeholder}</>;
}

function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const context = React.useContext(SelectContext);
  const contentRef = React.useRef<HTMLDivElement>(null);
  
  if (!context) {
    throw new Error("SelectContent must be used within Select");
  }

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        context.onOpenChange(false);
      }
    }

    if (context.open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [context.open, context.onOpenChange]);

  if (!context.open) {
    return null;
  }

  return (
    <div
      ref={contentRef}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SelectItem({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<"div"> & {
  value: string;
}) {
  const context = React.useContext(SelectContext);
  
  if (!context) {
    throw new Error("SelectItem must be used within Select");
  }

  const isSelected = context.value === value;

  return (
    <div
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        isSelected && "bg-accent text-accent-foreground",
        className
      )}
      onClick={() => context.onValueChange(value)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  );
}

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
};
