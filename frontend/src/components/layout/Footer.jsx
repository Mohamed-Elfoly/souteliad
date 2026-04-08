import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Send } from "lucide-react";
import Vector from "../../assets/images/Vector.png";
import Apple from "../../assets/images/Apple.png";
import Playstore from "../../assets/images/Playstore.png";

const QUICK_LINKS = [
  { label: "الصفحة الرئيسية", to: "/LandingpageLogin" },
  { label: "الدروس", to: "/Lessons" },
  { label: "المجتمع", to: "/Community" },
  { label: "حسابي", to: "/Personal" },
  { label: "الدعم", to: "/Personal/support" },
];



export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="footer" dir="rtl">
      <div className="footer-inner">

        {/* ── Col 1: Brand ── */}
        <div className="footer-col footer-col--brand">
          <div className="footer-brand-logo">
            <img src={Vector} alt="صوت اليد" />
            <span>صوت اليد</span>
          </div>
          <p className="footer-brand-tagline">
            نتواصل بلغة الإشارة، لنمنح الجميع صوتًا يُفهم
          </p>
          <div className="footer-store-row">
            <button className="footer-store-btn">
              <img src={Apple} alt="App Store" />
              <div>
                <span className="footer-store-sub">Download on the</span>
                <span className="footer-store-name">App Store</span>
              </div>
            </button>
            <button className="footer-store-btn">
              <img src={Playstore} alt="Google Play" />
              <div>
                <span className="footer-store-sub">GET IT ON</span>
                <span className="footer-store-name">Google Play</span>
              </div>
            </button>
          </div>
        </div>

        {/* ── Col 2: Quick Links ── */}
        <div className="footer-col">
          <h4 className="footer-col-title">روابط سريعة</h4>
          <ul className="footer-links">
            {QUICK_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="footer-link">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>


        {/* ── Col 4: Newsletter ── */}
        <div className="footer-col">
          <h4 className="footer-col-title">خليك دايمًا مع صوت اليد</h4>
          <p className="footer-col-desc">
            اشترك ليصلك أحدث الدروس والمحتوى التعليمي مباشرة.
          </p>
          <div className="footer-newsletter">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              className="footer-newsletter-input"
            />
            <button className="footer-newsletter-btn" onClick={() => setEmail("")}>
              <Send size={16} />
              اشترك
            </button>
          </div>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <span>© 2026 جميع الحقوق محفوظة لموقع صوت اليد</span>
      </div>
    </footer>
  );
}
