import { ReactNode } from "react";

type ErrorProps = { children: ReactNode };

export default function Error({ children }: ErrorProps) {
  return (
    <p className="bg-red-600 p-2 text-white font-bold text-sm text-center">
      {children}
    </p>
  );
}
