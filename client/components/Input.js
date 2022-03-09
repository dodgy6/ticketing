export default ({ label, value, onChange, ...other }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        className="form-control"
        value={value}
        onChange={onChange}
        {...other}
      />
    </div>
  );
};
