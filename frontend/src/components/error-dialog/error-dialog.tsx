import "./error-dialog.css";

interface IErrorDialogProps {
  hasError: boolean;
  error: Error | null;
  onOk: () => void;
}

export const ErrorDialog = (props: IErrorDialogProps) => {
  const { hasError, error, onOk } = props;

  return (
    <div id="error-dialog">
      <dialog open={hasError}>
        <div>
          <h3>⚠️ Something went wrong ⚠️</h3>
          <p>{error?.toString()}</p>
        </div>
        <button className="error" onClick={onOk}>
          OK
        </button>
      </dialog>
    </div>
  );
};
