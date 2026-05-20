type AlertProps = {
  variant?: "error" | "success" | "info";
  children: React.ReactNode;
};

const styles = {
  error: "border-red-500/40 bg-red-950/40 text-red-100",
  success: "border-emerald-500/40 bg-emerald-950/40 text-emerald-100",
  info: "border-sky-500/40 bg-sky-950/40 text-sky-100",
};

export function Alert({ variant = "info", children }: AlertProps) {
  return (
    <div
      role="alert"
      className={`rounded-lg border px-4 py-3 text-sm ${styles[variant]}`}
    >
      {children}
    </div>
  );
}
