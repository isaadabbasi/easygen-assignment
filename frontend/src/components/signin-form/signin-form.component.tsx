import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormErrors } from "src/components";
import { IAuth } from "src/defs";

interface ISignInFormProps {
  handleSubmit: (payload: IAuth.ISignInPayload) => void;
  errors: string[];
}
export const SignInForm = (props: ISignInFormProps): JSX.Element => {
  const { errors, handleSubmit } = props;
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState<IAuth.ISignInPayload>({
    email: "",
    password: "",
  });

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const _handleSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    handleSubmit(userInfo);
  };

  const navigateToSignUp = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/sign-up");
  };

  return (
    <form
      id="sign-in-form"
      className="bg-white border p-4 rounded cx-box-shadow"
    >
      <h2 className="uppercase font-bold">Sign In</h2>
      <br />
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          value={userInfo.email}
          onChange={onInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          name="password"
          value={userInfo.password}
          onChange={onInputChange}
        />
      </div>
      <FormErrors messages={errors} />
      <button
        className="w-full rounded bg-blue-600 text-white uppercase font-bold border-none h-10 hover:bg-blue-700"
        type="submit"
        onClick={_handleSubmit}
      >
        Sign In
      </button>
      <p className="m-2 text-center text-sm text-gray-500">
        Create an account!&nbsp;
        <a className="text-gray-500 font-bold uppercase" href="#" onClick={navigateToSignUp}>
          Sign Up
        </a>
      </p>
    </form>
  );
};
