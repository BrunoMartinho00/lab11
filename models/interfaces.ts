export interface Rating {
  id: number;
  rate: number;
  count: number;
}

export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: string;
  description: string;
  category: string;
  image: string; // URL relativa da imagem, ex: /media/produto_imagens/tshirt-1-1.png
  rating: Rating;
}