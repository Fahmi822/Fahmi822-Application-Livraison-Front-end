export interface Commande {
  message: string;
  livraisonId: number;
  commande: {
    id: number;
    clientId: number;
    clientNomComplet: string;
    dateCommande: string;
    montant: number;
    statut: string;
    produits: Produit[];
  };
}
  
  export interface Produit {
    id: number;
    nom: string;
    prix: number;
    description?: string;
  }