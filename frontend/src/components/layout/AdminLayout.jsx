import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
// import Header from './Header';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0 },
};

export default function AdminLayout() {
  const location = useLocation();

  return (
    /*
      KEY FIX:
      - "w-screen" is intentionally NOT used — use w-full instead
      - overflow-x-hidden on the root prevents any child from blowing out the viewport
      - The layout uses a CSS grid: sidebar has a fixed width, main gets the rest (1fr)
      - On small screens the sidebar collapses to icon-only (72px)
    */
    <div className="w-full min-h-screen overflow-x-hidden bg-gray-50" dir="rtl">
      {/* <Header /> */}
      <Navbar />

      {/* Layout: sidebar + main — grid keeps sidebar fixed-width */}
      <div className="grid" style={{ gridTemplateColumns: 'var(--sidebar-width, 240px) 1fr' }}>
        <Sidebar />

        {/* main must be min-w-0 so it never overflows its grid cell */}
        <main className="min-w-0 p-4 sm:p-6 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full min-w-0"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}