export default function FormField({
  label,
  error,
  icon: Icon,
  children,
  register,
  name,
  type = 'text',
  placeholder,
  validation,
}) {
  // If children are provided, render them as custom content
  if (children) {
    return (
      <div className="form-group">
        {label && <label>{label}</label>}
        {children}
        {error && <span className="form-error">{error}</span>}
      </div>
    );
  }

  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <div className="input-wrapper">
        <input
          type={type}
          placeholder={placeholder}
          {...(register ? register(name, validation) : { name })}
        />
        {Icon && <Icon size={18} />}
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
