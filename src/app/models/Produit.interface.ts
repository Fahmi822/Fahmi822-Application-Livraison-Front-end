
  export interface Produit {
    id: number;
    nom: string;
    description: string;
    prix: number;
    imgUP: File;
    quantite:number;
    img: string;
    categorieId: number;
    categorie?: {
      id: number;
      nom: string;
    };
    imageUrl?: string;  // <-- Ajoute cette ligne
  }
  