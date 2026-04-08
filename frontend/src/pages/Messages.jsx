import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import "../styles/login.css";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyNotifications } from "../api/notificationApi";

export default function Messages() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: notifsData, isLoading } = useQuery({
    queryKey: ['messages', currentPage],
    queryFn: () => getMyNotifications({ page: currentPage, limit: 8 }),
  });

  const messages = notifsData?.data?.data?.data || [];
  const totalResults = notifsData?.data?.results || 0;

  return (
    <div className="messages-container">
      <div className="chats_right">
        <h1 className="page-title">الدردشة</h1>
        <div className="search-container sea">
          <input type="text" placeholder="البحث" className="search-input stu_sea" />
          <Search className="search-icon stu_icon" size={20} />
        </div>
        <div className='chats'>
          {isLoading ? (
            <div className="admin-state admin-state--sm">جاري التحميل...</div>
          ) : messages.length === 0 ? (
            <div className="admin-state admin-state--sm admin-state--muted">لا توجد رسائل</div>
          ) : (
            messages.map((msg, i) => (
              <div className='chat_card' key={msg._id || i}>
                <img src={`https://ui-avatars.com/api/?name=${msg.sender?.firstName || 'U'}&background=f97316&color=fff&size=40`} alt="" />
                <div className='chat_card_text'>
                  <h2>{msg.sender?.firstName} {msg.sender?.lastName}</h2>
                  <p>{msg.message || ''}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="messages-table">
        <h1 className="page-title">الرسائل</h1>
        <div className="admin-table-wrap">
          {isLoading ? (
            <div className="admin-state">جاري التحميل...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>اسم المرسل</th>
                  <th>موضوع الرسالة</th>
                  <th>تاريخ الإرسال</th>
                  <th>الخيارات</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg, index) => (
                  <tr key={msg._id || index}>
                    <td>{msg.sender?.firstName} {msg.sender?.lastName}</td>
                    <td>{msg.message || ''}</td>
                    <td>{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('ar-EG') : ''}</td>
                    <td>
                      <button className="btn-orange-small">قراءة الرسالة</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="pagination">
          <div className='side'>
            <button className="pagination-button" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}><ChevronRight /></button>
            {[1, 2, 3, 4, 5].map(num => (
              <button key={num} className={`pagination-button ${currentPage === num ? 'active' : ''}`} onClick={() => setCurrentPage(num)}>{num}</button>
            ))}
            <button className="pagination-button" onClick={() => setCurrentPage(p => p + 1)}><ChevronLeft /></button>
          </div>
          <span className="pagination-info">أظهار {messages.length} من {totalResults || '٠'}</span>
        </div>
      </div>
    </div>
  );
}
