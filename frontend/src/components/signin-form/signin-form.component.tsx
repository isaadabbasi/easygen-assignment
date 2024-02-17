import { useState } from 'react'
import { FormErrors } from 'src/components'

export const SignInForm = (): JSX.Element => {
  const [userInfo, setUserInfo] = useState({
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

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    console.log(userInfo);
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
      <FormErrors messages={[]}/>
      <button type="submit">Sign In</button>
      <p className="rdr">
        Create an account! <a href="#">Sign In</a>
      </p>
    </form>
  );
};
