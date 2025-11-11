import Header from "../components/Header";
import NavBar from "../components/NavBar";
import ModalHost from "../components/ModalHost";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col pb-30 pt-26 px-12">
        {children}
      </main>

      <NavBar />

      <ModalHost />
    </div>
  );
}
