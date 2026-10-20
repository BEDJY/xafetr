import React, { useState, useEffect } from 'react';
import { VendureClient } from '../services/vendureClient';
import { X, AlertCircle, CheckCircle2, Loader2, UserPlus, Key } from 'lucide-react';

interface CreateAdministratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminCreated: () => void;
}

export const CreateAdministratorModal: React.FC<CreateAdministratorModalProps> = ({
  isOpen,
  onClose,
  onAdminCreated,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [availableRoles, setAvailableRoles] = useState<Array<{ id: string; code: string; description: string }>>([]);

  const [loadingRoles, setLoadingRoles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadRoles();
    }
  }, [isOpen]);

  const loadRoles = async () => {
    setLoadingRoles(true);
    try {
      const res = await VendureClient.request(`
        query GetRoles {
          roles {
            items {
              id
              code
              description
            }
          }
        }
      `);
      const items = res?.roles?.items || [];
      // Filter out customer role
      const adminRoles = items.filter((r: any) => r.code !== '__customer_role__');
      setAvailableRoles(adminRoles);
      if (adminRoles.length > 0) {
        setSelectedRoleId(adminRoles[0].id);
      }
    } catch (err: any) {
      console.warn('Could not load roles from Vendure:', err);
    } finally {
      setLoadingRoles(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !emailAddress.trim() || !password.trim()) {
      setErrorMsg('Por favor completa todos los campos requeridos.');
      return;
    }

    if (!selectedRoleId) {
      setErrorMsg('Por favor selecciona un rol para este administrador.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const mutation = `
        mutation CreateAdmin($input: CreateAdministratorInput!) {
          createAdministrator(input: $input) {
            id
            firstName
            lastName
            emailAddress
            user {
              roles {
                id
                code
              }
            }
          }
        }
      `;

      const input = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailAddress: emailAddress.trim(),
        password: password.trim(),
        roleIds: [selectedRoleId],
      };

      const res = await VendureClient.request(mutation, { input });
      if (res?.createAdministrator?.id) {
        setSuccessMsg(`¡Administrador ${firstName} ${lastName} creado exitosamente!`);
        setFirstName('');
        setLastName('');
        setEmailAddress('');
        setPassword('');
        onAdminCreated();
        setTimeout(() => {
          onClose();
          setSuccessMsg(null);
        }, 1200);
      } else {
        throw new Error('Respuesta inesperada al crear el administrador.');
      }
    } catch (err: any) {
      console.error('Error creating administrator:', err);
      setErrorMsg(err.message || 'Error al guardar el administrador');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Nuevo Administrador
              </h2>
              <p className="text-xs text-zinc-400">
                Otorga permisos de gestión para canales y catálogo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-500">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ej: Daniel"
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Apellidos *
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ej: Bedoya"
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Correo Electrónico (Usuario de Acceso) *
            </label>
            <input
              type="email"
              required
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="ejemplo@dobeha.com"
              className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Contraseña Inicial *
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-3.5 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          {/* Rol Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Rol de Seguridad y Permisos *
            </label>
            {loadingRoles ? (
              <div className="flex items-center gap-2 py-2 text-xs text-zinc-400">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-500" />
                <span>Cargando roles disponibles...</span>
              </div>
            ) : (
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white cursor-pointer"
              >
                {availableRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.code} - {r.description || 'Sin descripción'}
                  </option>
                ))}
              </select>
            )}
            <p className="mt-1 text-[11px] text-zinc-400">
              Determina si el usuario administra toda la plataforma o un canal / tienda específico.
            </p>
          </div>

          {/* Footer actions */}
          <div className="mt-6 flex items-center justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedRoleId}
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-purple-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creando...</span>
                </>
              ) : (
                <span>Crear Administrador</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
