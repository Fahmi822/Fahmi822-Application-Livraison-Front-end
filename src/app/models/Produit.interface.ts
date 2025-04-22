export interface Produit {
    id: number;           // Unique identifier for the product
    nom: string;          // Name of the product
    prix: number;         // Price of the product
    description: string;  // Description of the product
    quantite: number;     // Quantity available in stock
    img: string;          // URL or path of the image (for displaying the product image)
    imgUP: File;          // File object to hold the image to be uploaded
    categorieId: number;  // ID of the category the product belongs to
  }