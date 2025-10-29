export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
      {children}
    </main>
  );
}