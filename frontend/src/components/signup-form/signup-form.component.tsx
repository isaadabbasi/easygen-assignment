import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormErrors } from "src/components";
import { IAuth } from "src/defs";

interface ISignUpFormProps {
  handleSubmit: (payload: IAuth.ISignUpPayload) => void;
  errors: string[]
}
export function SignUpForm(props: ISignUpFormProps) {
  const { errors, handleSubmit } = props;
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState<IAuth.ISignUpPayload>({
    name: "",
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

  const navigateToSignIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <form id="sign-up-form">
      <h2 className="title">Sign Up</h2>
      <div className="form-group">
        <label htmlFor="email">Full Name:</label>
        <input
          id="name"
          type="text"
          name="name"
          value={userInfo.name}
          onChange={onInputChange}
        />
      </div>
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
        Sign Up
      </button>
      <p className="rdr">
        Already have an account?{" "}
        <a href="#" onClick={navigateToSignIn}>
          Sign In
        </a>
      </p>
    </form>
  );
}
