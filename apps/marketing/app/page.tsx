export default function HomePage() {
  // Bewusst ohne Design-Tokens: die kommen in Phase 02.
  // Farben entsprechen design-system v4.1 (Graphit, Goldener Faden).
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08080A] text-[#F8F7F4]">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 h-12 w-0.5 rounded-full bg-[#C9993A]" />
        <h1 className="text-6xl font-bold tracking-tight">Apex</h1>
        <p className="mt-3 text-base text-[#F8F7F4]/55">Marketing site — Phase 01</p>
      </div>
    </main>
  );
}
