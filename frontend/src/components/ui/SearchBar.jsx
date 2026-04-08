import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'البحث' }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder={placeholder}
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Search className="search-icon" size={20} />
    </div>
  );
}
