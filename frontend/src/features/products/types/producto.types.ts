import type { CategoriaBasica } from "@/features/categories";

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  imagenes_url: string[];
  disponible: boolean;
  categorias?: CategoriaBasica[];
}

export type ProductoFormData = Omit<Producto, "id" | "categorias">;
