// import { lazy, Suspense } from 'react';
// import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { ROLES } from './utils/constants';
// import LoadingSpinner from './components/ui/LoadingSpinner';
// import useAuth from './hooks/useAuth';

// // Route protection (always needed — not lazy)
// import ProtectedRoute from './components/ProtectedRoute';
// import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';

// // Layouts (always needed — not lazy)
// import AdminLayout from './components/layout/AdminLayout';
// import WebLayout from './components/layout/WebLayout';
// import ProfileLayout from './components/layout/ProfileLayout';

// // Renders AdminLayout for staff, WebLayout for regular users — keeps header consistent
// function PersonalLayout() {
//   const { user } = useAuth();
//   const isStaff = user?.role === ROLES.ADMIN || user?.role === ROLES.TEACHER;
//   return isStaff ? <AdminLayout /> : <WebLayout />;
// }

// // Redirects teachers → /Dashboard, admins → /Students; everyone else passes through
// function RedirectStaffOnly() {
//   const { isAuthenticated, isLoading, user } = useAuth();
//   if (isLoading) return null;
//   if (isAuthenticated) {
//     if (user?.role === ROLES.ADMIN) return <Navigate to="/Students" replace />;
//     if (user?.role === ROLES.TEACHER) return <Navigate to="/Dashboard" replace />;
//   }
//   return <Outlet />;
// }

// // Auth pages
// const Login                     = lazy(() => import('./pages/web/Login'));
// const Signup                    = lazy(() => import('./pages/web/Signup'));
// const ForgotPassword            = lazy(() => import('./pages/web/ForgotPassword'));
// const VerifyCode                = lazy(() => import('./pages/web/VerifyCode'));
// const ResetPassword             = lazy(() => import('./pages/web/ResetPassword'));
// const ErrorPage                 = lazy(() => import('./pages/web/ErrorPage'));

// // Dashboard auth pages
// const DashboardRoleSelect       = lazy(() => import('./pages/DashboardRoleSelect'));
// const DashboardLogin            = lazy(() => import('./pages/DashboardLogin'));
// const DashboardForgotPassword   = lazy(() => import('./pages/DashboardForgotPassword'));
// const DashboardVerifyCode       = lazy(() => import('./pages/DashboardVerifyCode'));
// const DashboardResetPassword    = lazy(() => import('./pages/DashboardResetPassword'));

// // Admin pages
// const Students                  = lazy(() => import('./pages/Students'));
// const Comments                  = lazy(() => import('./pages/Comments'));
// const AdminCommunity            = lazy(() => import('./pages/AdminCommunity'));  // replaces UserReviews + Groups + DashboardAsadmin
// const Notifications             = lazy(() => import('./pages/notifications'));
// const Settings                  = lazy(() => import('./pages/Settings'));
// const Messages                  = lazy(() => import('./pages/Messages'));

// // Teacher pages
// const Dashboard                 = lazy(() => import('./pages/Dashboard'));
// const Addlesson                 = lazy(() => import('./pages/addlesson'));
// const AddExamQuestions          = lazy(() => import('./pages/AddExamQuestions'));
// const Reports                   = lazy(() => import('./pages/reports'));
// const Controlasteachers         = lazy(() => import('./pages/Controlasteachers'));
// const Addlessonasteacher        = lazy(() => import('./pages/addlessonasteacher'));
// const StudentsTeacher           = lazy(() => import('./pages/StudentsTeacher'));
// const AddExamQuestionsasteacher = lazy(() => import('./pages/AddExamQuestionsasteacher'));
// const ManageContent             = lazy(() => import('./pages/ManageContent'));

// // Web pages
// const LandingpageLogin          = lazy(() => import('./pages/web/LandingpageLogin'));
// const Community                 = lazy(() => import('./pages/web/Community'));
// const Chats                     = lazy(() => import('./pages/web/Chats'));
// const Chat_Message              = lazy(() => import('./pages/web/Chat_Message'));
// const PersonalInfo              = lazy(() => import('./pages/web/PersonalInfo'));
// const Personalstandard          = lazy(() => import('./pages/web/Personalstandard'));
// const Personaledit              = lazy(() => import('./pages/web/Personaledit'));
// const Personalpassword          = lazy(() => import('./pages/web/Personalpassword'));
// const Grades                    = lazy(() => import('./pages/web/Grades'));
// const Support                   = lazy(() => import('./pages/web/Support'));
// const Problem                   = lazy(() => import('./pages/web/Problem'));
// const Solvenow                  = lazy(() => import('./pages/web/Solvenow'));

// // Lesson pages
// const Lessons                   = lazy(() => import('./pages/lessons/Lessons'));
// const Learnnow                  = lazy(() => import('./pages/lessons/Learnnow'));
// const Levelone                  = lazy(() => import('./pages/lessons/Levelone'));
// const Levelpage                 = lazy(() => import('./pages/lessons/Levelpage'));
// const Testyourself              = lazy(() => import('./pages/lessons/Testyourself'));
// const Quiz                      = lazy(() => import('./pages/lessons/Quiz'));
// const Result                    = lazy(() => import('./pages/lessons/Result'));

// // Routes staff must never see even for a single frame
// const STAFF_FORBIDDEN = ['/', '/LandingpageLogin', '/landingpage'];

// // Blocks all route rendering until auth state is resolved — prevents flash of wrong page
// function AppRoutes() {
//   const { isLoading, isAuthenticated, user } = useAuth();
//   const { pathname } = useLocation();

//   if (isLoading) return null;

//   // Hard-redirect staff before any route/component renders
//   if (isAuthenticated && STAFF_FORBIDDEN.includes(pathname)) {
//     if (user?.role === ROLES.ADMIN)   return <Navigate to="/Students" replace />;
//     if (user?.role === ROLES.TEACHER) return <Navigate to="/Dashboard" replace />;
//   }

//   return (
//     <Suspense fallback={<LoadingSpinner />}>
//       <Routes>
//         {/* ===== Root → Public Landing (staff redirected to their dashboard) ===== */}
//         <Route element={<RedirectStaffOnly />}>
//           <Route path="/" element={<Navigate to="/LandingpageLogin" replace />} />
//         </Route>

//         {/* ===== Dashboard Auth Pages (redirect if already logged in) ===== */}
//         <Route element={<RedirectIfAuthenticated />}>
//           <Route path="/dashboard-role"            element={<DashboardRoleSelect />} />
//           <Route path="/dashboard-login"           element={<DashboardLogin />} />
//           <Route path="/dashboard-forgot-password" element={<DashboardForgotPassword />} />
//           <Route path="/dashboard-verify-code"     element={<DashboardVerifyCode />} />
//           <Route path="/dashboard-reset-password"  element={<DashboardResetPassword />} />
//         </Route>

//         {/* ===== Admin-Only Pages (AdminLayout + admin role) ===== */}
//         <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
//           <Route element={<AdminLayout />}>
//             <Route path="/Students"     element={<Students />} />
//             <Route path="/Comments"     element={<Comments />} />
//             <Route path="/UserReviews"  element={<AdminCommunity />} />
//             <Route path="/notifications" element={<Notifications />} />
//             <Route path="/Settings"     element={<Settings />} />
//             <Route path="/Messages"     element={<Messages />} />
//           </Route>
//         </Route>

//         {/* ===== Teacher-Only Pages (AdminLayout + teacher role) ===== */}
//         <Route element={<ProtectedRoute allowedRoles={[ROLES.TEACHER]} />}>
//           <Route element={<AdminLayout />}>
//             <Route path="/Dashboard"                  element={<Dashboard />} />
//             <Route path="/Addlesson"                  element={<Addlesson />} />
//             <Route path="/StudentsTeacher"            element={<StudentsTeacher />} />
//             <Route path="/AddExamQuestions"           element={<AddExamQuestions />} />
//             <Route path="/Reports"                    element={<Reports />} />
//             <Route path="/Controlasteachers"          element={<Controlasteachers />} />
//             <Route path="/addlessonasteacher"         element={<Addlessonasteacher />} />
//             <Route path="/AddExamQuestionsasteacher"  element={<AddExamQuestionsasteacher />} />
//             <Route path="/ManageContent"              element={<ManageContent />} />
//           </Route>
//         </Route>

//         {/* ===== Adaptive pages — AdminLayout for staff, WebLayout for users ===== */}
//         <Route element={<ProtectedRoute />}>
//           <Route element={<PersonalLayout />}>
//             {/* Community — regular users see it with like/comment; admin sees it read-only */}
//             <Route path="/Community" element={<Community />} />
//             {/* Profile pages */}
//             <Route path="/Personal" element={<ProfileLayout />}>
//               <Route index element={<PersonalInfo />} />
//               <Route path="grades"          element={<Grades />} />
//               <Route path="support"         element={<Support />} />
//               <Route path="password"        element={<Personalpassword />} />
//               <Route path="edit"            element={<Personaledit />} />
//               <Route path="Personalstandard" element={<Personalstandard />} />
//             </Route>
//             <Route path="/Personal/edit"     element={<Personaledit />} />
//             <Route path="/Personal/password" element={<Personalpassword />} />
//             <Route path="/Personal/support"  element={<Support />} />
//           </Route>
//         </Route>

//         {/* ===== Web Pages (WebLayout: Navbar + Footer) ===== */}
//         <Route element={<WebLayout />}>
//           {/* Public auth pages (redirect away if already logged in) */}
//           <Route element={<RedirectIfAuthenticated />}>
//             <Route path="/login"          element={<Login />} />
//             <Route path="/signup"         element={<Signup />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             <Route path="/verify-code"    element={<VerifyCode />} />
//             <Route path="/reset-password" element={<ResetPassword />} />
//           </Route>

//           {/* Public landing page — staff redirected to their dashboard */}
//           <Route element={<RedirectStaffOnly />}>
//             <Route path="/LandingpageLogin" element={<LandingpageLogin />} />
//           </Route>
//           <Route path="/landingpage" element={<Navigate to="/LandingpageLogin" replace />} />

//           {/* User-only web pages */}
//           <Route element={<ProtectedRoute allowedRoles={[ROLES.USER]} />}>
//             <Route path="/Chats"        element={<Chats />} />
//             <Route path="/Chat_Message" element={<Chat_Message />} />
//             <Route path="/Problem"      element={<Problem />} />
//             <Route path="/Solvenow"     element={<Solvenow />} />
//           </Route>
//         </Route>

//         {/* ===== Lesson Pages — user only (WebLayout: Navbar + Footer) ===== */}
//         <Route element={<ProtectedRoute allowedRoles={[ROLES.USER]} />}>
//           <Route element={<WebLayout />}>
//             <Route path="/Lessons"                      element={<Lessons />} />
//             <Route path="/Learnnow/:lessonId"           element={<Learnnow />} />
//             <Route path="/Levelone/:lessonId"           element={<Levelone />} />
//             <Route path="/Levelpage/:levelId"           element={<Levelpage />} />
//             <Route path="/Testyourself/:lessonId"       element={<Testyourself />} />
//             <Route path="/quiz/:quizId/:questionNum"    element={<Quiz />} />
//             <Route path="/Result"                       element={<Result />} />
//           </Route>
//         </Route>

//         {/* ===== Backward-compatible redirects for removed admin pages ===== */}
//         <Route path="/DashboardAsadmin" element={<Navigate to="/UserReviews" replace />} />
//         <Route path="/Groups"           element={<Navigate to="/UserReviews" replace />} />

//         {/* Backward-compatible redirects for old auth routes */}
//         <Route path="/Loginlandingpage"      element={<Navigate to="/login" replace />} />
//         <Route path="/Createaccount"         element={<Navigate to="/signup" replace />} />
//         <Route path="/Repasswordlandingpage" element={<Navigate to="/forgot-password" replace />} />
//         <Route path="/Repassword"            element={<Navigate to="/forgot-password" replace />} />
//         <Route path="/Codelandingpage"       element={<Navigate to="/verify-code" replace />} />
//         <Route path="/Code"                  element={<Navigate to="/verify-code" replace />} />
//         <Route path="/Newpassword"           element={<Navigate to="/reset-password" replace />} />
//         <Route path="/Confirm"              element={<Navigate to="/reset-password" replace />} />

//         {/* Backward-compatible redirects for old profile routes */}
//         <Route path="/Personaledit"      element={<Navigate to="/Personal/edit" replace />} />
//         <Route path="/Personalpassword"  element={<Navigate to="/Personal/password" replace />} />
//         <Route path="/Personalstandard " element={<Navigate to="/Personal/Personalstandard" replace />} />
//         <Route path="/Grades"            element={<Navigate to="/Personal/grades" replace />} />
//         <Route path="/Support"           element={<Navigate to="/Personal/support" replace />} />

//         {/* Backward-compatible redirects for old question/lesson routes */}
//         <Route path="/Learnnow"          element={<Navigate to="/Lessons" replace />} />
//         <Route path="/Levelone"          element={<Navigate to="/Lessons" replace />} />
//         <Route path="/Levelpage"         element={<Navigate to="/Lessons" replace />} />
//         <Route path="/Testyourself"      element={<Navigate to="/Lessons" replace />} />
//         <Route path="/Firstquestion"     element={<Navigate to="/Lessons" replace />} />
//         <Route path="/Secondquestion"    element={<Navigate to="/Lessons" replace />} />
//         <Route path="/Thirdquestion"     element={<Navigate to="/Lessons" replace />} />
//         <Route path="/Fourthquestion"    element={<Navigate to="/Lessons" replace />} />
//         <Route path="/fourthquestion"    element={<Navigate to="/Lessons" replace />} />
//         <Route path="/FiveQuestion"      element={<Navigate to="/Lessons" replace />} />
//         <Route path="/fivequestion"      element={<Navigate to="/Lessons" replace />} />
//         <Route path="/Sixquestion"       element={<Navigate to="/Lessons" replace />} />
//         <Route path="/sixquestion"       element={<Navigate to="/Lessons" replace />} />
//         <Route path="/Sevenquestion"     element={<Navigate to="/Lessons" replace />} />
//         <Route path="/Playvideo"         element={<Navigate to="/Lessons" replace />} />
//         <Route path="/Eightquestionplay" element={<Navigate to="/Lessons" replace />} />
//         <Route path="/Eightquestion"     element={<Navigate to="/Lessons" replace />} />
//         <Route path="/Congratulation"    element={<Navigate to="/Lessons" replace />} />

//         {/* ===== Catch-all Error Page (public) ===== */}
//         <Route element={<WebLayout />}>
//           <Route path="*" element={<ErrorPage />} />
//         </Route>
//       </Routes>
//     </Suspense>
//   );
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <Toaster
//         position="top-center"
//         toastOptions={{
//           duration: 3000,
//           style: { direction: 'rtl', fontFamily: 'inherit' },
//         }}
//       />
//       <AppRoutes />
//     </BrowserRouter>
//   );
// }

// export default App;

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ROLES } from './utils/constants';
import LoadingSpinner from './components/ui/LoadingSpinner';
import useAuth from './hooks/useAuth';

import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';

import AdminLayout from './components/layout/AdminLayout';
import WebLayout from './components/layout/WebLayout';
import ProfileLayout from './components/layout/ProfileLayout';

function PersonalLayout() {
  const { user } = useAuth();
  const isStaff = user?.role === ROLES.ADMIN || user?.role === ROLES.TEACHER;
  return isStaff ? <AdminLayout /> : <WebLayout />;
}

function RedirectStaffOnly() {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) {
    if (user?.role === ROLES.ADMIN) return <Navigate to="/Students" replace />;
    if (user?.role === ROLES.TEACHER) return <Navigate to="/Dashboard" replace />;
  }
  return <Outlet />;
}

const Login                     = lazy(() => import('./pages/web/Login'));
const Signup                    = lazy(() => import('./pages/web/Signup'));
const ForgotPassword            = lazy(() => import('./pages/web/ForgotPassword'));
const VerifyCode                = lazy(() => import('./pages/web/VerifyCode'));
const ResetPassword             = lazy(() => import('./pages/web/ResetPassword'));
const ErrorPage                 = lazy(() => import('./pages/web/ErrorPage'));

const DashboardRoleSelect       = lazy(() => import('./pages/DashboardRoleSelect'));
const DashboardLogin            = lazy(() => import('./pages/DashboardLogin'));
const DashboardForgotPassword   = lazy(() => import('./pages/DashboardForgotPassword'));
const DashboardVerifyCode       = lazy(() => import('./pages/DashboardVerifyCode'));
const DashboardResetPassword    = lazy(() => import('./pages/DashboardResetPassword'));

const Students                  = lazy(() => import('./pages/Students'));
const Comments                  = lazy(() => import('./pages/Comments'));
const AdminCommunity            = lazy(() => import('./pages/AdminCommunity'));
const NotificationsPage         = lazy(() => import('./pages/notifications')); 
const Settings                  = lazy(() => import('./pages/Settings'));
const Messages                  = lazy(() => import('./pages/Messages'));

const Dashboard                 = lazy(() => import('./pages/Dashboard'));
// const Addlesson                 = lazy(() => import('./pages/addlesson'));
const AddLessonPage             = lazy(() => import('./pages/lessonsAndQuizzes/AddLessonPage'));
// const AddExamQuestions          = lazy(() => import('./pages/AddExamQuestions'));
const AddQuizPage               = lazy(() => import('./pages/lessonsAndQuizzes/AddQuizPage'));
const Reports                   = lazy(() => import('./pages/reports'));
// const Controlasteachers         = lazy(() => import('./pages/Controlasteachers'));
// const Addlessonasteacher        = lazy(() => import('./pages/addlessonasteacher'));
// const AddLessonAsTeacherPage    = lazy(() => import('./pages/lessonsAndQuizzes/AddLessonAsTeacherPage'));
const StudentsTeacher           = lazy(() => import('./pages/StudentsTeacher'));
// const AddExamQuestionsasteacher = lazy(() => import('./pages/AddExamQuestionsasteacher'));
// const AddQuizAsTeacherPage      = lazy(() => import('./pages/lessonsAndQuizzes/AddQuizAsTeacherPage'));
const ManageContent             = lazy(() => import('./pages/ManageContent'));

const LandingpageLogin          = lazy(() => import('./pages/LandingpageLogin'));
const Community                 = lazy(() => import('./pages/web/Community'));
const Chats                     = lazy(() => import('./pages/web/Chats'));
const Chat_Message              = lazy(() => import('./pages/web/Chat_Message'));
const PersonalInfo              = lazy(() => import('./pages/web/PersonalInfo'));
const Personalstandard          = lazy(() => import('./pages/web/Personalstandard'));
const Personaledit              = lazy(() => import('./pages/web/Personaledit'));
const Personalpassword          = lazy(() => import('./pages/web/Personalpassword'));
const Grades                    = lazy(() => import('./pages/web/Grades'));
const Support                   = lazy(() => import('./pages/web/Support'));
const Problem                   = lazy(() => import('./pages/web/Problem'));
const Solvenow                  = lazy(() => import('./pages/web/Solvenow'));

const Lessons                   = lazy(() => import('./pages/lessons/Lessons'));
const Learnnow                  = lazy(() => import('./pages/lessons/Learnnow'));
const Levelone                  = lazy(() => import('./pages/lessons/Levelone'));
const Levelpage                 = lazy(() => import('./pages/lessons/Levelpage'));
const Testyourself              = lazy(() => import('./pages/lessons/Testyourself'));
const Quiz                      = lazy(() => import('./pages/lessons/Quiz'));
const Result                    = lazy(() => import('./pages/lessons/Result'));

const STAFF_FORBIDDEN = ['/', '/LandingpageLogin', '/landingpage'];

function AppRoutes() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const { pathname } = useLocation();

  if (isLoading) return null;

  if (isAuthenticated && STAFF_FORBIDDEN.includes(pathname)) {
    if (user?.role === ROLES.ADMIN)   return <Navigate to="/Students" replace />;
    if (user?.role === ROLES.TEACHER) return <Navigate to="/Dashboard" replace />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<RedirectStaffOnly />}>
          <Route path="/" element={<Navigate to="/LandingpageLogin" replace />} />
        </Route>

        <Route element={<RedirectIfAuthenticated />}>
          <Route path="/dashboard-role"            element={<DashboardRoleSelect />} />
          <Route path="/dashboard-login"           element={<DashboardLogin />} />
          <Route path="/dashboard-forgot-password" element={<DashboardForgotPassword />} />
          <Route path="/dashboard-verify-code"     element={<DashboardVerifyCode />} />
          <Route path="/dashboard-reset-password"  element={<DashboardResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/Students"       element={<Students />} />
            <Route path="/Comments"       element={<Comments />} />
            <Route path="/UserReviews"    element={<AdminCommunity />} />
            <Route path="/Settings"       element={<Settings />} />
            <Route path="/Messages"       element={<Messages />} />
          </Route>
        </Route>

        {/* <Route element={<ProtectedRoute allowedRoles={[ROLES.TEACHER]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/Dashboard"                  element={<Dashboard />} />
            <Route path="/Addlesson"                  element={<Addlesson />} />
            <Route path="/StudentsTeacher"            element={<StudentsTeacher />} />
            <Route path="/AddExamQuestions"           element={<AddExamQuestions />} />
            <Route path="/Reports"                    element={<Reports />} />
            <Route path="/Controlasteachers"          element={<Controlasteachers />} />
            <Route path="/addlessonasteacher"         element={<Addlessonasteacher />} />
            <Route path="/AddExamQuestionsasteacher"  element={<AddExamQuestionsasteacher />} />
            <Route path="/ManageContent"              element={<ManageContent />} />
          </Route>
        </Route> */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.TEACHER]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/Dashboard"                  element={<Dashboard />} />
            <Route path="/AddLessonPage"              element={<AddLessonPage />} />
            <Route path="/AddQuizPage"                element={<AddQuizPage />} />
            <Route path="/StudentsTeacher"            element={<StudentsTeacher />} />
            <Route path="/Reports"                    element={<Reports />} />
            {/* <Route path="/Controlasteachers"          element={<Controlasteachers />} /> */}
            {/* <Route path="/AddLessonAsTeacherPage"     element={<AddLessonAsTeacherPage />} /> */}
            {/* <Route path="/AddQuizAsTeacherPage"       element={<AddQuizAsTeacherPage />} /> */}
            <Route path="/ManageContent"              element={<ManageContent />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<PersonalLayout />}>
            <Route path="/Community" element={<Community />} />
            
            {/* Shared Notifications Page for all authenticated users */}
            <Route path="/notifications" element={<NotificationsPage />} />
            
            <Route path="/Personal" element={<ProfileLayout />}>
              <Route index element={<PersonalInfo />} />
              <Route path="grades"          element={<Grades />} />
              <Route path="support"         element={<Support />} />
              <Route path="password"        element={<Personalpassword />} />
              <Route path="edit"            element={<Personaledit />} />
              <Route path="Personalstandard" element={<Personalstandard />} />
            </Route>
          </Route>
        </Route>

        <Route element={<WebLayout />}>
          <Route element={<RedirectIfAuthenticated />}>
            <Route path="/login"          element={<Login />} />
            <Route path="/signup"         element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-code"    element={<VerifyCode />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          <Route element={<RedirectStaffOnly />}>
            <Route path="/LandingpageLogin" element={<LandingpageLogin />} />
          </Route>
          <Route path="/landingpage" element={<Navigate to="/LandingpageLogin" replace />} />
          <Route element={<ProtectedRoute allowedRoles={[ROLES.USER]} />}>
            <Route path="/Chats"        element={<Chats />} />
            <Route path="/Chat_Message" element={<Chat_Message />} />
            <Route path="/Problem"      element={<Problem />} />
            <Route path="/Solvenow"     element={<Solvenow />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.USER]} />}>
          <Route element={<WebLayout />}>
            <Route path="/Lessons"                      element={<Lessons />} />
            <Route path="/Learnnow/:lessonId"           element={<Learnnow />} />
            <Route path="/Levelone/:lessonId"           element={<Levelone />} />
            <Route path="/Levelpage/:levelId"           element={<Levelpage />} />
            <Route path="/Testyourself/:lessonId"       element={<Testyourself />} />
            <Route path="/quiz/:quizId/:questionNum"    element={<Quiz />} />
            <Route path="/Result"                       element={<Result />} />
          </Route>
        </Route>

        <Route path="*" element={<WebLayout><ErrorPage /></WebLayout>} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { direction: 'rtl', fontFamily: 'inherit' },
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;