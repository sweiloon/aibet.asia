export const Buttons = ({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`relative rounded-lg bg-gradient-to-b from-[#190d2e] to-[#4a208a] px-5 py-3 text-sm font-medium shadow-[0px_0px_12px_#8c45ff] ${className}`}
      {...props}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 rounded-lg border border-white/20 [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
        <div className="absolute inset-0 rounded-lg border border-white/40 [mask-image:linear-gradient(to_top,black,transparent)]"></div>
        <div className="absolute inset-0 rounded-lg shadow-[0_0_10px_rgb(140,69,255,.7)_inset]"></div>
      </div>
      <span>{children}</span>
    </button>
  );
};
