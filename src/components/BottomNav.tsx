import { Home, Search, PlusCircle, ShoppingCart, User } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const { totalItems } = useCart();

  const navItems = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/catalog', icon: Search, label: 'Explorar' },
    { to: '/sell', icon: PlusCircle, label: 'Vender', isMain: true },
    { to: '/cart', icon: ShoppingCart, label: 'Carrito', badge: totalItems },
    { to: '/profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-area-pb">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200"
            activeClassName="text-primary"
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                <div className="relative">
                  {item.isMain ? (
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      className="bg-primary rounded-full p-3 -mt-6 shadow-glow"
                    >
                      <item.icon className="w-6 h-6 text-primary-foreground" />
                    </motion.div>
                  ) : (
                    <>
                      <item.icon
                        className={`w-6 h-6 transition-colors ${
                          isActive ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      />
                      {item.badge && item.badge > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full"
                        >
                          {item.badge > 9 ? '9+' : item.badge}
                        </motion.span>
                      )}
                    </>
                  )}
                </div>
                <span
                  className={`text-xs font-medium ${
                    item.isMain ? 'mt-1' : ''
                  } ${isActive && !item.isMain ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
