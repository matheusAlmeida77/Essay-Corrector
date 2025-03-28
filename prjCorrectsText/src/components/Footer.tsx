
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-sesi-dark py-12 text-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-sesi-red">SESI Sorocaba</h3>
            <p className="text-sm text-white/80 max-w-xs">
              Corretor Inteligente de Redações, desenvolvido para auxiliar professores
              de Língua Portuguesa na avaliação de textos.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-white/80 hover:text-white transition-colors">Início</Link>
              </li>
              <li>
                <Link to="/upload" className="text-sm text-white/80 hover:text-white transition-colors">Corrigir Redações</Link>
              </li>
              <li>
                <Link to="/results" className="text-sm text-white/80 hover:text-white transition-colors">Resultados</Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-white/80 hover:text-white transition-colors">Sobre</Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Contato</h4>
            <p className="text-sm text-white/80">
              SESI Sorocaba<br />
              Rua Duque de Caxias, 494<br />
              Mangal - Vila Leão, Sorocaba - SP
            </p>
            <p className="text-sm text-white/80">
              <a href="mailto:contato@sesi-sp.org.br" className="hover:text-white transition-colors">
              Tel: (15) 3388-0429
              </a>
            </p>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-white/60">
            © {currentYear} SESI-SP Sorocaba. Todos os direitos reservados.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-xs text-white/60">
              Desenvolvido como projeto escolar (Murilo Moreno e Rafael Prudencio)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
