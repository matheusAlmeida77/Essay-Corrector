import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import imgHeader from "../assets/logoFooter.webp";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="">
          <img className="w-64" src={imgHeader} alt="" />
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" label="Início" pathname={location.pathname} />
          <NavLink
            to="/upload"
            label="Corrigir Redações"
            pathname={location.pathname}
          />
          <NavLink
            to="/results"
            label="Resultados"
            pathname={location.pathname}
          />
          <NavLink to="/about" label="Sobre" pathname={location.pathname} />
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated && user?.role === "admin" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-200 flex items-center gap-2"
                >
                  <User size={16} />
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 cursor-pointer gap-2"
                >
                  <LogOut size={16} />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/auth"
              className="text-sm font-medium bg-sesi-red text-white px-4 py-2 rounded-md hover:bg-sesi-redHover transition-colors duration-300"
            >
              Área do Professor
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({
  to,
  label,
  pathname,
}: {
  to: string;
  label: string;
  pathname: string;
}) => {
  const isActive = pathname === to;

  return (
    <Link
      to={to}
      className={`relative font-medium text-sm transition-colors duration-300 ${
        isActive ? "text-sesi-red" : "text-sesi-dark hover:text-sesi-red"
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-sesi-red rounded-full" />
      )}
    </Link>
  );
};

export default Navbar;
