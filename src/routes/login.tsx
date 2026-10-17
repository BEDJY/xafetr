import { LoginForm } from '@/vdb/components/login/login-form.js';
import { LoginBranding } from '@/vdb/components/shared/powered-by-vendure.js';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/vdb/components/ui/card.js';
import { LS_KEY_SELECTED_CHANNEL_TOKEN } from '@/vdb/constants.js';
import { useAuth } from '@/vdb/hooks/use-auth.js';
import { useUserSettings } from '@/vdb/hooks/use-user-settings.js';
import { z } from '@/vdb/lib/zod.js';
import { createFileRoute, Navigate, redirect, useRouterState } from '@tanstack/react-router';
import { Palette, Store } from 'lucide-react';
import * as React from 'react';
import { StoreAppearanceDialog } from '@/vdb/components/shared/store-appearance-dialog.js';

const fallback = '/' as const;

export const Route = createFileRoute('/login')({
    validateSearch: z.object({
        redirect: z.string().optional().catch(''),
        selectStore: z.union([z.boolean(), z.string().transform(v => v === 'true')]).optional().catch(false),
    }),
    beforeLoad: () => {
        // Permite acceder a /login directamente para ver/cambiar de tienda o cerrar sesión
    },
    component: LoginPage,
});

function LoginPage() {
    const auth = useAuth();
    const { setActiveChannelId } = useUserSettings();
    const isLoading = useRouterState({ select: s => s.isLoading });
    const navigate = Route.useNavigate();
    const search = Route.useSearch();
    const [showStoreSelector, setShowStoreSelector] = React.useState(true);
    const [editingChannel, setEditingChannel] = React.useState<{ id: string; code: string; token?: string } | null>(null);
    const [appearanceDialogOpen, setAppearanceDialogOpen] = React.useState(false);

    const onFormSubmit = (username: string, password: string) => {
        auth.login(username, password, () => {
            setShowStoreSelector(true);
        });
    };

    const handleSelectStore = (channelId: string, channelToken: string) => {
        try {
            localStorage.setItem(LS_KEY_SELECTED_CHANNEL_TOKEN, channelToken);
        } catch (e) {
            console.error('Failed to store channel token', e);
        }
        setActiveChannelId(channelId);
        navigate({ to: search.redirect || fallback });
    };

    const isVerifying = isLoading || auth.status === 'verifying';

    const ambientBackground = (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Glow Orb 1 - Cyan/Sky */}
            <div
                className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full opacity-60 mix-blend-screen filter blur-[90px]"
                style={{
                    background: 'radial-gradient(circle, rgba(56, 189, 248, 0.45) 0%, rgba(37, 99, 235, 0.25) 50%, transparent 70%)',
                    animation: 'orbitFloat1 18s ease-in-out infinite alternate',
                }}
            />
            {/* Glow Orb 2 - Purple/Violet */}
            <div
                className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full opacity-55 mix-blend-screen filter blur-[100px]"
                style={{
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(79, 70, 229, 0.25) 50%, transparent 70%)',
                    animation: 'orbitFloat2 22s ease-in-out infinite alternate',
                }}
            />
            {/* Glow Orb 3 - Emerald/Teal Accent */}
            <div
                className="absolute top-[40%] left-[30%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full opacity-35 mix-blend-screen filter blur-[80px]"
                style={{
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(14, 165, 233, 0.2) 50%, transparent 70%)',
                    animation: 'orbitFloat3 15s ease-in-out infinite alternate',
                }}
            />
            {/* Subtle dot pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.12]"
                style={{
                    backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            />
            <style>{`
                @keyframes orbitFloat1 {
                    0% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
                    50% { transform: translate(70px, 50px) rotate(45deg) scale(1.12); }
                    100% { transform: translate(-30px, 80px) rotate(90deg) scale(0.96); }
                }
                @keyframes orbitFloat2 {
                    0% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
                    50% { transform: translate(-80px, -60px) rotate(-60deg) scale(1.18); }
                    100% { transform: translate(40px, -90px) rotate(-120deg) scale(0.92); }
                }
                @keyframes orbitFloat3 {
                    0% { transform: translate(0px, 0px) scale(0.95); }
                    50% { transform: translate(-40px, 40px) scale(1.2); }
                    100% { transform: translate(50px, -30px) scale(1); }
                }
            `}</style>
        </div>
    );

    if (auth.isAuthenticated) {
        return (
            <div className="relative min-h-svh w-full flex flex-col items-center justify-center p-6 md:p-10 overflow-hidden bg-slate-950 text-foreground selection:bg-sky-500/30">
                {ambientBackground}

                <div className="relative z-10 w-full max-w-lg md:max-w-xl">
                    <div className="rounded-3xl border border-white/20 bg-slate-900/65 dark:bg-slate-950/65 backdrop-blur-2xl p-6 md:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] ring-1 ring-white/10 transition-all">
                        <div className="text-center pb-4">
                            <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500/25 via-indigo-500/25 to-purple-500/30 border border-white/20 text-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.35)] backdrop-blur-md">
                                <Store className="h-8 w-8" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                                Selecciona una Tienda
                            </h1>
                            <p className="text-sm text-slate-300/80 mt-1.5 max-w-sm mx-auto">
                                Tu cuenta tiene acceso a <span className="font-semibold text-sky-400">{auth.channels?.length || 0} tiendas</span>. Elige cuál deseas gestionar:
                            </p>
                        </div>

                        <div className="pt-2 space-y-3">
                            {auth.channels && auth.channels.length > 0 ? (
                                auth.channels.map(channel => (
                                    <div
                                        key={channel.id}
                                        className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.09] hover:border-sky-400/40 transition-all duration-300 text-left group shadow-sm backdrop-blur-md hover:shadow-[0_4px_20px_rgba(56,189,248,0.15)]"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-600/30 border border-white/15 text-sky-300 font-bold text-base group-hover:from-sky-500 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                                {channel.code.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white group-hover:text-sky-300 transition-colors text-base">
                                                    {channel.code === '__default_channel__' ? 'Tienda Principal' : channel.code}
                                                </h4>
                                                <p className="text-xs text-slate-400 font-mono mt-0.5">
                                                    Canal: <code className="text-sky-300/90">{channel.code}</code>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingChannel(channel);
                                                    setAppearanceDialogOpen(true);
                                                }}
                                                className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all shadow-sm cursor-pointer"
                                                title="Personalizar colores, logotipo y apariencia visual"
                                            >
                                                <Palette className="h-3.5 w-3.5 text-sky-400" />
                                                <span>Editar UI</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleSelectStore(channel.id, channel.token)}
                                                className="flex items-center gap-1 text-xs font-semibold text-sky-300 px-3.5 py-2 rounded-xl bg-sky-500/20 border border-sky-400/30 hover:bg-sky-500 hover:text-white hover:border-transparent transition-all shadow-sm cursor-pointer"
                                                title="Administrar tienda y abrir panel"
                                            >
                                                <span>Administrar &rarr;</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-slate-400">
                                    No se encontraron tiendas asignadas a esta cuenta.
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-4 flex items-center justify-between border-t border-white/10 text-xs text-slate-400 gap-3">
                            <button
                                type="button"
                                onClick={() => navigate({ to: search.redirect || fallback })}
                                className="text-sky-400 hover:text-sky-300 hover:underline font-semibold cursor-pointer transition-colors"
                            >
                                &larr; Ir al Panel Principal
                            </button>
                            <div className="flex items-center gap-3">
                                <span>Conectado: <strong className="text-slate-200">{auth.user?.identifier || 'Administrador'}</strong></span>
                                <button
                                    type="button"
                                    onClick={() => auth.logout()}
                                    className="text-rose-400 hover:text-rose-300 hover:underline font-medium cursor-pointer transition-colors"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <LoginBranding />
                    </div>
                </div>

                <StoreAppearanceDialog
                    channel={editingChannel}
                    open={appearanceDialogOpen}
                    onOpenChange={setAppearanceDialogOpen}
                />
            </div>
        );
    }

    return (
        <div className="relative min-h-svh w-full flex flex-col items-center justify-center p-6 md:p-10 overflow-hidden bg-slate-950 text-foreground selection:bg-sky-500/30">
            {ambientBackground}

            <div className="relative z-10 w-full max-w-sm md:max-w-md">
                <div className="rounded-3xl border border-white/15 bg-slate-900/65 dark:bg-slate-950/65 backdrop-blur-2xl p-6 md:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] ring-1 ring-white/10">
                    <LoginForm
                        onFormSubmit={onFormSubmit}
                        isVerifying={isVerifying}
                        loginError={auth.authenticationError}
                    />
                </div>
                <div className="mt-4 text-center">
                    <LoginBranding />
                </div>
            </div>
        </div>
    );
}
