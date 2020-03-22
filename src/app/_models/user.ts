export class User {
  id: number;
  number: number;
  username: string;
  hash: string;
  firstName: string;
  lastName: string;
  email: string;
  type: string;
  role: string;
  status?: string;
  token?: string;
  apiKey?: {
    apiKey: string;
    apiKeySecret: string;
  };
}
