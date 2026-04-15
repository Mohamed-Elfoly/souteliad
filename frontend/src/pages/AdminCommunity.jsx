/**
 * AdminCommunity.jsx  —  pages/AdminCommunity.jsx
 *
 * Tabs:
 *   1. اراء المستخدمين  → ReviewsTab
 *   2. مشاكل المستخدمين → SupportTicketsTab   ← NEW
 *   3. المنشورات        → PostsTab
 */

import { useState } from 'react';
import { FileText, LayoutList, LifeBuoy } from 'lucide-react';
import ReviewsTab        from '../components/adminCommunity/reviews/ReviewsTab';
import SupportTicketsTab from '../components/adminCommunity/support/SupportTicketsTab';
import PostsTab          from '../components/adminCommunity/posts/PostsTab';

const PRIMARY = '#EB6837';

const TABS = [
  { id: 'reviews',  label: 'اراء المستخدمين',   icon: FileText   },
  { id: 'support',  label: 'مشاكل المستخدمين',  icon: LifeBuoy   },
  { id: 'posts',    label: 'المنشورات',           icon: LayoutList },
];

export default function AdminCommunity() {
  const [activeTab, setActiveTab] = useState('reviews');

  return (
    <div className="min-h-screen bg-white font-[Rubik,system-ui,sans-serif]" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* ── Tab Switcher ── */}
        <div className="flex gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  flex-1 flex items-center justify-center gap-1.5 sm:gap-2
                  py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-medium
                  transition-all duration-200 cursor-pointer
                  ${active
                    ? 'text-white shadow-sm'
                    : 'bg-[#FDF0EB] text-gray-500 border border-[#F9D0C1] hover:bg-[#FDEADF]'
                  }
                `}
                style={active ? { background: PRIMARY } : {}}
              >
                <Icon size={16} strokeWidth={active ? 2.5 : 2} className="shrink-0" />
                {/* Full label on md+, short on mobile */}
                <span className="hidden md:inline">{label}</span>
                <span className="md:hidden text-xs">
                  {id === 'reviews' ? 'التقييمات' : id === 'support' ? 'المشاكل' : 'المنشورات'}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
          {activeTab === 'reviews' && <ReviewsTab />}
          {activeTab === 'support' && <SupportTicketsTab />}
          {activeTab === 'posts'   && <PostsTab />}
        </div>

      </div>
    </div>
  );
}