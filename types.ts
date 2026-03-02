export interface Official {
  id: string;
  name: string;
  perguruan: string;
  uniqueCode: string;
  isAdmin?: boolean;
}

export interface Athlete {
  id: string;
  name: string;
  birthPlaceDate: string;
  gender: 'Putra' | 'Putri';
  weight: number;
  height: number;
  nik: string;
  kontingen: string;
  category: 'Tanding' | 'Seni';
  classes: string[]; // Changed from class: string to classes: string[]
  files: {
    kk?: string;
    parentPermission?: string;
    doctorNote?: string;
    photo?: string;
  };
}

export interface Registration {
  id: string;
  official: Official;
  athletes: Athlete[];
  method: 'Transfer' | 'COD';
  timestamp: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
}

export interface News {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  image: string;
}
