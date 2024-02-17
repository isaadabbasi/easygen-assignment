import "./form-errors.css";

interface IFormErrorsProps {
  messages: string[];
}

export const FormErrors = (props: IFormErrorsProps) => {
  // IMP - It's not recommended to use key={index}(index as key)
  // But, we don't have better options for now
  const errors = props.messages.map(
    (msg, index) => <li key={index}>{msg}</li>
  );
  if (errors.length === 0) return null;

  return (
    <div id="form-errors">
      <span className="label">Form Errors:</span>
      <ul>{errors}</ul>
    </div>
  );
};
