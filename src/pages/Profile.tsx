import { Settings, Package, Heart, Star, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const menuItems = [
    { icon: Package, label: 'Mis publicaciones', count: 3 },
    { icon: Heart, label: 'Favoritos', count: 12 },
    { icon: Star, label: 'Mis reseñas' },
    { icon: Settings, label: 'Configuración' },
    { icon: HelpCircle, label: 'Ayuda' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary pt-12 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-20 h-20 bg-primary-foreground/20 rounded-full flex items-center justify-center border-4 border-primary-foreground/30">
            <span className="text-3xl font-bold text-primary-foreground">U</span>
          </div>
          <div className="text-primary-foreground">
            <h1 className="text-xl font-bold">Usuario Demo</h1>
            <p className="text-primary-foreground/80">usuario@ejemplo.com</p>
          </div>
        </motion.div>
      </header>

      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="container -mt-10 relative z-10"
      >
        <div className="bg-card rounded-2xl shadow-elevated p-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">3</p>
            <p className="text-sm text-muted-foreground">Ventas</p>
          </div>
          <div className="text-center border-x border-border">
            <p className="text-2xl font-bold text-primary">7</p>
            <p className="text-sm text-muted-foreground">Compras</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-teal">4.8</p>
            <p className="text-sm text-muted-foreground">Rating</p>
          </div>
        </div>
      </motion.div>

      {/* Menu Items */}
      <main className="container py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl shadow-card overflow-hidden"
        >
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors border-b border-border last:border-0"
            >
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                <item.icon className="w-5 h-5 text-foreground" />
              </div>
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.count && (
                <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full mt-6 flex items-center justify-center gap-2 p-4 bg-destructive/10 text-destructive rounded-2xl font-medium hover:bg-destructive/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Cerrar sesión
        </motion.button>

        <p className="text-center text-muted-foreground text-sm mt-8">
          MarketHub v1.0.0
        </p>
      </main>
    </div>
  );
};

export default Profile;
