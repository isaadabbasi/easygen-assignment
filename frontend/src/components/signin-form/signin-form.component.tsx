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
    <form id="sign-in-form">
      <h2 className="title">Sign In</h2>
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
      <button className="primary" type="submit" onClick={_handleSubmit}>
        Sign In
      </button>
      <p className="rdr">
        Create an account!{" "}
        <a href="#" onClick={navigateToSignUp}>
          Sign Up
        </a>
      </p>
    </form>
  );
};
