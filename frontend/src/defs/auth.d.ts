export interface ISignInPayload {
  email: string;
  password: string;
}

export interface ISignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface IUser {
  _id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  name: string;
}
