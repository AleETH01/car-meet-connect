
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}

export enum MeetCategory {
  ESTATICA = 'Exposición Estática',
  DRIFT = 'Drift Session',
  RODADA = 'Rodada Nocturna',
  TRACK = 'Track Day',
  CLASICOS = 'Clásicos',
  MULTIMARCA = 'Multimarca',
  DEPORTIVOS = 'Deportivos',
  CAMIONETAS = 'Camionetas',
  CAMIONES = 'Camiones',
  OTROS = 'Otros'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  crewIds: string[];
  lastCreatedMeetAt?: number;
}

export interface Crew {
  id: string;
  name: string;
  category: MeetCategory;
  memberCount: number;
  adminId: string;
}

export interface Meet {
  id: string;
  name: string;
  category: MeetCategory;
  startTime: number;
  endTime: number;
  latitude: number;
  longitude: number;
  maxVehicles: number;
  currentVehicles: number;
  description: string;
  isPrivate: boolean;
  crewId?: string;
  creatorId: string;
}

export interface AppState {
  currentUser: User | null;
  meets: Meet[];
  crews: Crew[];
  activeView: 'map' | 'login' | 'crews' | 'profile' | 'splash';
}
