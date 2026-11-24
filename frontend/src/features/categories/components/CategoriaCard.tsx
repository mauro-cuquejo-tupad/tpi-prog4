import React from "react";
import type { Categoria } from "../types/categoria.types";

interface CategoriaCardProps {
  categoria: Categoria;
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
}

export const CategoriaCard: React.FC<CategoriaCardProps> = ({
  categoria,
  onEdit,
  onDelete,
}) => {
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors border-b border-slate-200 dark:border-gray-700">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
        {categoria.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800 dark:text-slate-100">
        {categoria.nombre}
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
        {categoria.descripcion}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
        <button
          type="button"
          onClick={() => onEdit(categoria)}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium hover:underline cursor-pointer"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => onDelete(categoria.id)}
          className="text-rose-600 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 font-medium hover:underline cursor-pointer"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
};

export default CategoriaCard;
