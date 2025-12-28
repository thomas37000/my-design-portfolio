export interface Dev_project {
  id: number;
  name: string;
  description: string;
  fini: boolean;
  nom_projet: string;
  technos: string[];
  titre: string;
  lien_url: string;
  github: string;
  img: string;
  organisme: string;
  IA: boolean;
}

export interface Designer_project {
  id: number;
  description: string;
  fini: boolean;
  nom_projet: string;
  logiciels: string[];
  tags: string[];
  titre: string;
  lien_url: string;
  img: string;
  organisme: string;
  IA: boolean;
}
