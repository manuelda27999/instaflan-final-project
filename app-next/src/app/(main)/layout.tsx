import Header from "../components/Header";
import NavBar from "../components/NavBar";
import ModalHost from "../components/ModalHost";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full">
      <Header />

      <main className="pt-16 pb-16">{children}</main>

      <NavBar />

      <ModalHost />
    </div>
  );
}
