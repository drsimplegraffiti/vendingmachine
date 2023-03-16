import { IsNotEmpty } from 'class-validator';

export class UserDTO {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  username: string;
}

export class UserRO {
  id: string;
  username: string;
  created: Date;
  token: string;
}
