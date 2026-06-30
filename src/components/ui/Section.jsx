// Card with a coloured dot header, used to group related form fields
export default function Section({ title, children }) {
  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <div className="card-header">
        <div className="card-header-dot" />
        <span className="card-header-title">{title}</span>
      </div>
      <div className="card-body">
        <div className="form-grid">{children}</div>
      </div>
    </div>
  );
}
