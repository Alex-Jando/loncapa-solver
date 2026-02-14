interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 36, className = "" }: LogoProps) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <img src="/favicon/favicon-96x96.png" alt="" className="h-full w-full object-cover" />
    </div>
  );
}

