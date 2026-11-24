import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table";
import type { Ingrediente } from "../types/ingrediente.types";
import { EmptyState } from "@/shared/components/SharedModalsAndStates";

interface IngredienteListProps {
  ingredientes: Ingrediente[];
  isAdmin?: boolean;
  onEdit: (ingrediente: Ingrediente) => void;
  onDelete: (id: number) => void;
}

const columnHelper = createColumnHelper<Ingrediente>();

export const IngredienteList: React.FC<IngredienteListProps> = ({
  ingredientes,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<Ingrediente, any>[]>(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cols: ColumnDef<Ingrediente, any>[] = [
      columnHelper.accessor("id", {
        header: () => "ID",
        cell: (info) => (
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-semibold">
            #{info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("nombre", {
        header: () => "Nombre",
        cell: (info) => (
          <span className="font-semibold text-slate-900 dark:text-slate-100">{info.getValue()}</span>
        ),
      }),
    ];

    if (isAdmin) {
      cols.push(
        columnHelper.display({
          id: "acciones",
          header: () => <span className="text-right block">Acciones</span>,
          cell: (props) => (
            <div className="text-right space-x-3">
              <button
                type="button"
                onClick={() => onEdit(props.row.original)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium text-sm hover:underline cursor-pointer"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => onDelete(props.row.original.id)}
                className="text-rose-600 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 font-medium text-sm hover:underline cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          ),
        })
      );
    }

    return cols;
  }, [isAdmin, onEdit, onDelete]);

  const table = useReactTable({
    data: ingredientes,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  if (ingredientes.length === 0) {
    return <EmptyState message="No hay ingredientes registrados en el sistema." />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden">
      {/* Barra de Filtro Rápido */}
      <div className="p-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <input
          type="text"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar ingredientes..."
          className="w-full sm:max-w-xs rounded-md border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
        />
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Mostrando {table.getRowModel().rows.length} de {ingredientes.length} ingredientes
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-gray-700">
          <thead className="bg-slate-50 dark:bg-gray-900/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={`px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider ${
                      header.column.getCanSort() ? "cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-gray-700" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span>
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-slate-200 dark:divide-gray-700">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="px-6 py-3 border-t border-slate-200 dark:border-gray-700 flex items-center justify-between bg-slate-50 dark:bg-gray-900/50">
        <div className="text-xs text-slate-600 dark:text-slate-400">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount() || 1}
        </div>
        <div className="space-x-2">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default IngredienteList;
