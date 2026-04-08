import { Cloud } from 'lucide-react';

export default function FileUpload({ label, accept, onChange, fileName }) {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <label className="upload-box">
        <Cloud size={32} color="#EB6837" />
        <span>{fileName || 'اسحب الملف هنا أو اضغط للاختيار'}</span>
        <input
          type="file"
          accept={accept}
          onChange={onChange}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  );
}
