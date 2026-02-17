export interface IRegister {
  username: string;
  email: string;
  password: string;
  weight_kg: string;
  daily_calorie_goal: string;
}

export interface IRegisterErrors {
  username: { message: string };
  email: { message: string };
  password: { message: string };
  weight_kg: { message: string };
  daily_calorie_goal: { message: string };
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginErrors {
  email: { message: string };
  password: { message: string };
}
