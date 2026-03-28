import type { PropsWithChildren } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}