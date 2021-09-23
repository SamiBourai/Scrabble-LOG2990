


export interface VrUser
{
  name:string;
  level:string;
  round:string;
  score:number;


}

export interface RealUser extends VrUser{
  firstToPlay:boolean;
}
