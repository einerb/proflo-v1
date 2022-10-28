export class Login {
  public identification: number;
  public password: string;

  constructor(item: any) {
    this.identification = item.identification ? item.identification : null;
    this.password = item.password ? item.password : null;
  }
}
