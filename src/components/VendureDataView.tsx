import React, { useEffect, useState } from 'react';
import { VendureClient } from '../services/vendureClient';
import { RefreshCw, Search, Plus, Download } from 'lucide-react';
import { useChannel } from '../context/ChannelContext';

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
}

interface Props<T> {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  query: string;
  queryResultKey: string;
  columns: ColumnDef<T>[];
  actionButtonText?: string;
  onActionButtonClick?: () => void;
  onRowClick?: (row: T) => void;
  mockFallback?: T[];
}

export function VendureDataView<T extends { id: string }>({
  title,
  subtitle,
  icon: Icon,
  query,
  queryResultKey,
  columns,
  actionButtonText,
  onActionButtonClick,
  onRowClick,
  mockFallback = [],
}: Props<T>) {
  const { activeChannel } = useChannel();
  const [data, setData] = useState<T[]>(mockFallback);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await VendureClient.request<Record<string, any>>(query);
      const result = res[queryResultKey];
      const items = Array.isArray(result) ? result : result?.items || [];
      if (items.length > 0) {
        setData(items);
      } else if (mockFallback.length > 0) {
        setData(mockFallback);
      } else {
        setData([]);
      }
    } catch (err) {
      console.warn(`Aviso al consultar ${queryResultKey}:`, err);
      if (mockFallback.length > 0) {
        setData(mockFallback);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const handleRefresh = () => {
      fetchData();
    };
    window.addEventListener('channel-changed', handleRefresh);
    window.addEventListener('auth-changed', handleRefresh);
    return () => {
      window.removeEventListener('channel-changed', handleRefresh);
      window.removeEventListener('auth-changed', handleRefresh);
    };
  }, [activeChannel]);

  const filteredData = data.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  const exportToCSV = () => {
    if (!filteredData || filteredData.length === 0) return;
    const headers = columns.map(c => `"${c.header}"`).join(',');
    const rows = filteredData.map(row => {
      return columns.map(c => {
        let val = c.accessorKey ? (row as any)[c.accessorKey] : '';
        if (typeof val === 'object' && val !== null) {
          val = (val as any).name || (val as any).code || JSON.stringify(val);
        }
        const stringVal = String(val ?? '').replace(/"/g, '""');
        return `"${stringVal}"`;
      }).join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200/80 pb-5 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
              {title}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportToCSV}
            disabled={filteredData.length === 0}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-40 cursor-pointer"
            title="Exportar registros filtrados a formato CSV / Excel"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          <button
            onClick={fetchData}
            disabled={isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750 disabled:opacity-50"
            title="Recargar datos"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {actionButtonText && (
            <button
              onClick={onActionButtonClick}
              className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              <Plus className="h-4 w-4" />
              <span>{actionButtonText}</span>
            </button>
          )}
        </div>
      </div>

      {/* Buscador y Filtro */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Buscar en ${title.toLowerCase()}...`}
            className="w-full rounded-xl border border-zinc-200/80 bg-white py-2 pl-9 pr-4 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
          />
        </div>
        <div className="text-xs font-semibold text-zinc-500">
          Total: <span className="text-zinc-900 dark:text-white font-bold">{filteredData.length}</span>
        </div>
      </div>

      {/* Tabla de Datos */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-200 bg-zinc-50/70 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
              <tr>
                {columns.map((col, cIdx) => (
                  <th key={cIdx} className="px-4 py-3">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              {filteredData.length > 0 ? (
                filteredData.map((row, rIdx) => (
                  <tr
                    key={row.id || (row as any).name || (row as any).code || rIdx}
                    onClick={() => onRowClick?.(row)}
                    className={`transition hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 ${
                      onRowClick ? 'cursor-pointer hover:bg-sky-50/50 dark:hover:bg-sky-950/20' : ''
                    }`}
                  >
                    {columns.map((col, cIdx) => (
                      <td key={cIdx} className="px-4 py-3 whitespace-nowrap">
                        {col.cell ? col.cell(row) : (row[col.accessorKey as keyof T] as any)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-12 text-center text-xs text-zinc-400"
                  >
                    No se encontraron registros en este canal/tienda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
