import React, { useState } from 'react';
import { X, Send, Loader2, Clock, Mail, Tag, User, FileText } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { replyToTicket } from '../../../api/supportApi';
import { timeAgo } from '../shared/timeAgo';


const PRIMARY = '#EB6837';

export default function TicketActionModal({ ticket, onClose, onReplied }) {
  const queryClient = useQueryClient();
  const [reply, setReply] = useState(ticket?.adminReply ?? '');
  const isResolved = ticket?.status === 'resolved';

  const mutation = useMutation({
    mutationFn: (text) => replyToTicket(ticket._id, text),
    onSuccess: (_, text) => {
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
      onReplied?.(ticket._id, text);
      onClose();
    },
  });

  if (!ticket) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" dir="rtl">
        {/* Header */}
        <div className="px-6 py-4 shadow flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EB6837]/10 flex items-center justify-center">
              <FileText size={20} className="text-[#EB6837]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">تفاصيل تذكرة الدعم</h3>
              {/* <p className="text-xs text-gray-400">ID: {ticket._id}</p> */}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* User Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <InfoBox icon={<User size={14}/>} label="المُرسل" value={ticket.fullName || 'مجهول'} />
            <InfoBox icon={<Mail size={14}/>} label="البريد الإلكتروني" value={ticket.email}  />
            <InfoBox icon={<Tag size={14}/>} label="سبب التواصل" value={ticket.reason} />
            <InfoBox icon={<Clock size={14}/>} label="تاريخ الإرسال" value={timeAgo(ticket.createdAt)} />
          </div>

          {/* Message Body */}
          <div>
            <span className="text-xs font-bold text-gray-400 block mb-2 mr-1">محتوى الرسالة</span>
            <div className="bg-white border border-gray-200 p-4 rounded-2xl text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {ticket.message}
            </div>
          </div>

          {/* Reply Section */}
          <div>
            <span className="text-xs font-bold text-gray-400 block mb-2 mr-1">الرد على المستخدم</span>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              disabled={isResolved}
              placeholder={isResolved ? "تم الرد على هذه التذكرة سابقاً" : "اكتب ردك الفني هنا..."}
              rows={4}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#EB6837] focus:ring-4 focus:ring-[#EB6837]/5 transition-all text-sm resize-none disabled:opacity-60"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6  bg-gray-50/50 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
            إغلاق النافذة
          </button>
          {!isResolved && (
            <button
              onClick={() => mutation.mutate(reply)}
              disabled={mutation.isPending || !reply.trim()}
              className="flex-[2] py-3 bg-[#EB6837] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {mutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              إرسال الرد النهائي
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoBox({ icon, label, value, isLtr }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] text-gray-400 flex items-center gap-1">{icon} {label}</p>
      <p className={`text-sm font-semibold text-gray-700 truncate ${isLtr ? 'text-left' : ''}`} dir={isLtr ? 'ltr' : 'rtl'}>
        {value}
      </p>
    </div>
  );
}