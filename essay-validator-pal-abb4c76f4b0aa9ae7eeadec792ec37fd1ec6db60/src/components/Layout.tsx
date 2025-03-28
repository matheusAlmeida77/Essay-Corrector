
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
}

const Layout = ({ children, fullWidth = false }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-grow pt-16 ${fullWidth ? '' : 'container mx-auto px-6'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
