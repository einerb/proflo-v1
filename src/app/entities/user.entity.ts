import { Car } from "./car.entity";
import { Workshop } from "./workshop.entity";

export class User {
  id?: number;
  identification?: number;
  name?: string;
  lastname?: string;
  gender?: boolean;
  avatar?: string;
  role: Role;
  occupation?: string;
  city?: string;
  address?: string;
  birthdate?: string;
  phone?: string;
  email?: string;
  password?: string;
  state?: boolean;
  createdAt?: string;
  car?: [Car];
  public workshops?: Workshop;
  services?: string[];

  constructor(item?: User) {
    this.id = item && item.id ? item.id : 0;
    this.identification = item && item.identification ? item.identification : 0;
    this.name = item && item.name ? item.name : "";
    this.lastname = item && item.lastname ? item.lastname : "";
    this.gender = item && item.gender ? item.gender : true;
    this.avatar = item && item.avatar ? item.avatar : "";
    this.occupation = item && item.occupation ? item.occupation : "";
    this.city = item && item.city ? item.city : "";
    this.address = item && item.address ? item.address : "";
    this.birthdate = item && item.birthdate ? item.birthdate : "";
    this.phone = item && item.phone ? item.phone : "";
    this.email = item && item.email ? item.email : "";
    this.password = item && item.password ? item.password : "";
    this.state = item && item.state ? item.state : true;
    this.createdAt = item && item.createdAt ? item.createdAt : "";
  }
}

export class Role {
  role: string;
}
