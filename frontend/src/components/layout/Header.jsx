// import { useState, useRef, useEffect } from 'react';
// import { Settings, LogOut } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import useAuth from '../../hooks/useAuth';
// import { ROLES } from '../../utils/constants';
// import useModal from '../../hooks/useModal';
// import LogoutModal from '../ui/LogoutModal';
// import Avatar from '../ui/Avatar';
// import logo1 from '../../assets/images/logo1.png';

// const AllSettingsItems = [
//   { to: '/Personal/edit', label: 'تعديل بيانات حسابي الشخصي' },
//   { to: '/Personal/password', label: 'تغيير كلمة المرور' },
//   { to: '/Personal/support', label: 'الدعم', hideFor: [ROLES.ADMIN] },
// ];

// export default function Header() {
//   const { user } = useAuth();
//   const logoutModal = useModal();
//   const homeLink = user?.role === ROLES.ADMIN ? '/Students' : '/Dashboard';
//   const [settingsOpen, setSettingsOpen] = useState(false);
//   const settingsRef = useRef(null);
//   const settingsItems = AllSettingsItems.filter((item) => !item.hideFor.includes(user?.role));

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (settingsRef.current && !settingsRef.current.contains(e.target)) {
//         setSettingsOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   return (
//     <>
//       <header 
//         className="w-full h-[70px] bg-white border-b border-gray-200 sticky top-0 z-40 px-4 md:px-10"
//         dir="rtl"
//       >
//         <div className="h-full flex items-center justify-between">
//           <div className="flex items-center">
//             <Link to={homeLink}>
//               <img src={logo1} alt="logo" className="w-[60px] h-auto object-contain" />
//             </Link>
//           </div>

//           <div className="flex items-center gap-4">
//             {/* User Pill with original styles */}
//             <Link 
//               to="/Personal" 
//               className="flex items-center gap-2 bg-[#EB6837] text-white px-4 py-2 rounded-full text-base font-bold hover:bg-[#d55a2b] transition-colors"
//             >
//               <Avatar
//                 src={user?.profilePicture}
//                 name={`${user?.firstName || ''} ${user?.lastName || ''}`}
//                 iconSize={18}
//                 iconColor="#fff"
//                 className="w-8 h-8 rounded-full"
//               />
//               <span className="hidden sm:inline">{user?.firstName || 'المستخدم'}</span>
//               <span className="w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
//             </Link>

//             {/* Settings Dropdown */}
//             <div className="relative" ref={settingsRef}>
//               <button
//                 className={`p-2.5 rounded-lg transition-colors cursor-pointer ${
//                   settingsOpen ? 'bg-orange-50 text-[#EB6837]' : 'text-gray-500 hover:bg-gray-100'
//                 }`}
//                 onClick={() => setSettingsOpen((o) => !o)}
//               >
//                 <Settings size={22} />
//               </button>

//               {settingsOpen && (
//                 <>
//                   <div className="fixed inset-0 z-[9998] bg-transparent" onClick={() => setSettingsOpen(false)} />
//                   <div 
//                     className="fixed top-[80px] left-4 md:left-[100px] w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
//                   >
//                     {settingsItems.map((item) => (
//                       <Link
//                         key={item.to}
//                         to={item.to}
//                         className="block px-6 py-4 text-[15px] text-gray-700 hover:bg-orange-50 hover:text-[#EB6837] border-b border-gray-50 last:border-0 transition-colors text-right"
//                         onClick={() => setSettingsOpen(false)}
//                       >
//                         {item.label}
//                       </Link>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>

//             <button 
//               className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-base font-medium cursor-pointer"
//               onClick={logoutModal.open}
//             >
//               <LogOut size={20} />
//               <span className="hidden md:inline">تسجيل خروج</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       <LogoutModal isOpen={logoutModal.isOpen} onClose={logoutModal.close} />
//     </>
//   );
// }