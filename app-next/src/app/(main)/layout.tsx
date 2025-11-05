import Header from "../components/Header";
import NavBar from "../components/NavBar";
import ModalHost from "../components/ModalHost";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-400/15 blur-3xl animate-glow" />
        <div className="absolute top-1/3 right-[-6rem] h-72 w-72 rounded-full bg-sky-400/10 blur-3xl animate-float" />
        <div className="absolute bottom-[-5rem] left-[-4rem] h-96 w-96 rounded-full bg-purple-500/10 blur-3xl animate-glow" />
      </div>

      <Header />

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-32 pt-24 sm:px-6 lg:px-8">
        {children}
      </main>

      <NavBar />

      <ModalHost />
    </div>
  );
}
