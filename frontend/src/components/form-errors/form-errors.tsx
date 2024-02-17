import "./form-errors.css";

interface IFormErrorsProps {
  messages: string[];
}

export const FormErrors = (props: IFormErrorsProps) => {
  const errors = props.messages.map((msg) => <li>{msg}</li>);
  
  if (errors.length === 0) return null;

  return (
    <div id="form-errors">
      <span className="label">Form Errors:</span>
      <ul>{errors}</ul>
    </div>
  );
};
