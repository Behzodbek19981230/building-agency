import { HardHat } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <HardHat className="w-6 h-6 text-primary" />
              BuildHub
            </div>
            <p className="text-sm">Qurilish va ta'mirlash xizmatlari uchun ishonchli platforma.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Platforma</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/projects" className="hover:text-white transition-colors">Loyihalar</Link></li>
              <li><Link to="/workers" className="hover:text-white transition-colors">Ustalar</Link></li>
              <li><Link to="/auth/register" className="hover:text-white transition-colors">Ro'yxatdan o'tish</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Xizmatlar</h3>
            <ul className="space-y-2 text-sm">
              <li>Quruvchi</li>
              <li>Elektrik</li>
              <li>Santexnik</li>
              <li>Molyar</li>
              <li>Dizayner</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Aloqa</h3>
            <ul className="space-y-2 text-sm">
              <li>info@buildhub.uz</li>
              <li>+998 71 200 00 00</li>
              <li>Toshkent, O'zbekiston</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          © {new Date().getFullYear()} BuildHub. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  );
}
