export interface UserInterface {
  id?: string;
  email: string;
  name: string;
  lastName: string;
  password?: string;
  token?: string;
  currentUserChallengeId?: string;
  createdAt?: string;
  updatedAt?: string;
  numOfGames?: number;
  numOfVictories?: number;
}
