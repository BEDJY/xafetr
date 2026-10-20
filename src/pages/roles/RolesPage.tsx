import React, { useState } from 'react';
import { VendureClient } from '../../services/vendureClient';
import { VendureDataView } from '../../components/VendureDataView';
import { Shield, Plus, X, Check, AlertCircle, Loader2 } from 'lucide-react';

interface Role {
  id: string;
  code: string;
  description: string;
  permissions: string[];
  channels?: Array<{ id: string; code: string; token: string }>;
}

const AVAILABLE_PERMISSIONS = [
  { code: 'Authenticated', label: 'Autenticado' },
  { code: 'SuperAdmin', label: 'Super Administrador Global' },
  { code: 'ReadCatalog', label: 'Ver Catálogo y Productos' },
  { code: 'CreateCatalog', label: 'Crear Productos y Colecciones' },
  { code: 'UpdateCatalog', label: 'Modificar Productos' },
  { code: 'DeleteCatalog', label: 'Eliminar Productos' },
  { code: 'ReadOrder', label: 'Ver Pedidos y Ventas' },
  { code: 'CreateOrder', label: 'Crear Pedidos' },
  { code: 'UpdateOrder', label: 'Actualizar y Procesar Pedidos' },
  { code: 'DeleteOrder', label: 'Cancelar Pedidos' },
  { code: 'ReadCustomer', label: 'Ver Clientes' },
  { code: 'CreateCustomer', label: 'Registrar Clientes' },
  { code: 'UpdateCustomer', label: 'Editar Clientes' },
  { code: 'DeleteCustomer', label: 'Eliminar Clientes' },
  { code: 'ReadSettings', label: 'Ver Configuración' },
  { code: 'UpdateSettings', label: 'Modificar Configuración y Envíos' },
  { code: 'ReadAdministrator', label: 'Ver Administradores' },
  { code: 'UpdateAdministrator', label: 'Gestionar Administradores' },
];

export const RolesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'Authenticated',
    'ReadCatalog',
    'ReadOrder',
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const togglePermission = (perm: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !description.trim()) {
      setErrorMsg('Por favor ingresa el código y la descripción del rol.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const mutation = `
        mutation CreateRole($input: CreateRoleInput!) {
          createRole(input: $input) {
            id
            code
            description
            permissions
          }
        }
      `;

      await VendureClient.request(mutation, {
        input: {
          code: code.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
          description: description.trim(),
          permissions: selectedPermissions,
        },
      });

      setIsModalOpen(false);
      setCode('');
      setDescription('');
      window.dispatchEvent(new CustomEvent('channel-changed'));
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al crear el rol en Vendure.');
    } finally {
      setIsLoading(false);
    }
  };

  const query = `
    query GetRoles {
      roles(options: { take: 50 }) {
        items {
          id
          code
          description
          permissions
          channels {
            id
            code
            token
          }
        }
      }
    }
  `;

  return (
    <>
      <VendureDataView<Role>
        title="Roles & Permisos de Acceso"
        subtitle="Administra perfiles de seguridad, niveles de autorización y permisos por tienda o globales"
        icon={Shield}
        query={query}
        queryResultKey="roles"
        actionButtonText="Nuevo Rol"
        onActionButtonClick={() => setIsModalOpen(true)}
        columns={[
          {
            header: 'Código del Rol',
            accessorKey: 'code',
            cell: (row) => (
              <span className="font-mono font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                {row.code}
              </span>
            ),
          },
          {
            header: 'Descripción',
            accessorKey: 'description',
            cell: (row) => (
              <span className="font-medium text-zinc-900 dark:text-white">
                {row.description || 'Sin descripción'}
              </span>
            ),
          },
          {
            header: 'Permisos Asignados',
            cell: (row) => (
              <div className="flex flex-wrap gap-1 max-w-md">
                {row.permissions?.slice(0, 4).map((p) => (
                  <span
                    key={p}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                  >
                    {p}
                  </span>
                ))}
                {row.permissions && row.permissions.length > 4 && (
                  <span className="text-[10px] font-bold text-zinc-400 self-center">
                    +{row.permissions.length - 4} más
                  </span>
                )}
              </div>
            ),
          },
          {
            header: 'Canales Asignados',
            cell: (row) => (
              <span className="text-xs text-zinc-500">
                {row.channels && row.channels.length > 0
                  ? row.channels.map((c) => c.code).join(', ')
                  : 'Canal Activo'}
              </span>
            ),
          },
        ]}
      />

      {/* Modal Crear Rol */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Crear Perfil de Rol</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Define permisos granulares para tu equipo de trabajo
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400 shrink-0">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateRole} className="mt-5 space-y-4 overflow-y-auto pr-1 flex-1">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Identificador / Código del Rol *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej: catalog-editor, order-manager, supervisor-tienda"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-hidden focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:bg-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Descripción del Puesto / Rol *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej: Encargado de inventario y pedidos de la sucursal"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-hidden focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:bg-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  Matriz de Permisos ({selectedPermissions.length} seleccionados)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40">
                  {AVAILABLE_PERMISSIONS.map((perm) => {
                    const isSelected = selectedPermissions.includes(perm.code);
                    return (
                      <button
                        type="button"
                        key={perm.code}
                        onClick={() => togglePermission(perm.code)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                        }`}
                      >
                        <div
                          className={`h-4 w-4 rounded-md flex items-center justify-center border ${
                            isSelected
                              ? 'bg-white text-indigo-600 border-white'
                              : 'border-zinc-300 dark:border-zinc-700'
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[11px]">{perm.label}</p>
                          <p className={`text-[9px] font-mono ${isSelected ? 'text-indigo-200' : 'text-zinc-400'}`}>
                            {perm.code}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                  className="rounded-xl border border-zinc-300 px-4 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 cursor-pointer"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  <span>Guardar Rol</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
