import { Button } from '@/vdb/components/ui/button.js';
import { Card, CardContent } from '@/vdb/components/ui/card.js';
import { Input } from '@/vdb/components/ui/input.js';
import { PasswordInput } from '@/vdb/components/ui/password-input.js';
import { cn } from '@/vdb/lib/utils.js';
import { z, zodResolver } from '@/vdb/lib/zod.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from '@/vdb/components/ui/sonner.js';
import { useLoginExtensions } from '../../framework/extension-api/use-login-extensions.js';
import { LogoMark } from '../shared/logo-mark.js';
import { Form } from '../ui/form.js';
import { Field, FieldError } from '../ui/field.js';
import { Separator } from '../ui/separator.js';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/vdb/components/ui/dialog.js';

export type LoginFormProps = Readonly<
    {
        loginError?: string;
        isVerifying?: boolean;
        onFormSubmit?: (username: string, password: string) => void;
    } & React.ComponentProps<'div'>
>;

const formSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
});

export function LoginForm({ className, onFormSubmit, isVerifying, loginError, ...props }: LoginFormProps) {
    const loginExtensions = useLoginExtensions();
    const { t } = useLingui();

    React.useEffect(() => {
        if (loginError && !isVerifying) {
            toast.error(loginError, { id: 'login-error' });
        }
    }, [loginError, isVerifying]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const [isRegisterOpen, setIsRegisterOpen] = React.useState(false);
    const [regFirstName, setRegFirstName] = React.useState('');
    const [regLastName, setRegLastName] = React.useState('');
    const [regEmail, setRegEmail] = React.useState('');
    const [regPassword, setRegPassword] = React.useState('');
    const [isRegistering, setIsRegistering] = React.useState(false);

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsRegistering(true);
        try {
            toast.success('¡Solicitud de cuenta registrada con éxito! Ya puedes iniciar sesión.');
            setIsRegisterOpen(false);
            setRegFirstName('');
            setRegLastName('');
            setRegEmail('');
            setRegPassword('');
        } catch (err: any) {
            toast.error('Error al registrar cuenta: ' + err.message);
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <div className={cn('flex flex-col items-center gap-6', className)} {...props}>
            {loginExtensions.logo ? (
                <loginExtensions.logo.component />
            ) : (
                <LogoMark className="text-brand h-8 w-auto" />
            )}
            <Card className="w-full">
                <CardContent>
                    <Form {...form}>
                        <form
                            className="flex flex-col items-center gap-6"
                            onSubmit={form.handleSubmit(data => onFormSubmit?.(data.username, data.password))}
                        >
                            {loginExtensions.beforeForm ? (
                                <div className="w-full">
                                    <loginExtensions.beforeForm.component />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-center gap-1">
                                    <h1 className="text-2xl font-semibold tracking-tight">
                                        <Trans>Welcome to Vendure</Trans>
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        <Trans>Sign in to access the admin dashboard</Trans>
                                    </p>
                                </div>
                            )}
                            <div className="grid gap-4 w-full">
                                <Controller
                                    control={form.control}
                                    name="username"
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid || undefined}>
                                            <Input {...field} id="field-username" placeholder={t`Email`} aria-invalid={fieldState.invalid || undefined} />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    control={form.control}
                                    name="password"
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid || undefined}>
                                            <PasswordInput {...field} id="field-password" placeholder={t`Password`} aria-invalid={fieldState.invalid || undefined} />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            <div className="flex justify-end">
                                                <Link
                                                    to="/forgot-password"
                                                    className="text-sm text-muted-foreground hover:text-foreground"
                                                >
                                                    <Trans>Forgot password?</Trans>
                                                </Link>
                                            </div>
                                        </Field>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isVerifying}>
                                    {isVerifying && (
                                        <>
                                            <Loader2 className="animate-spin" />
                                            Please wait
                                        </>
                                    )}
                                    {!isVerifying && <Trans>Sign in</Trans>}
                                </Button>
                                <div className="text-center text-sm text-muted-foreground pt-1">
                                    <span>¿No tienes una cuenta? </span>
                                    <button
                                        type="button"
                                        onClick={() => setIsRegisterOpen(true)}
                                        className="text-primary font-medium underline underline-offset-4 hover:text-primary/80 transition-colors cursor-pointer"
                                    >
                                        Crear una cuenta
                                    </button>
                                </div>
                            </div>
                            {loginExtensions.afterForm && (
                                <>
                                    <Separator className="w-full" />
                                    <loginExtensions.afterForm.component />
                                </>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Crear una cuenta</DialogTitle>
                        <DialogDescription>
                            Ingresa tus datos para registrar una nueva cuenta en el panel.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleRegisterSubmit} className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-foreground">Nombre</label>
                                <Input
                                    placeholder="Tu nombre"
                                    required
                                    value={regFirstName}
                                    onChange={e => setRegFirstName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-foreground">Apellido</label>
                                <Input
                                    placeholder="Tu apellido"
                                    required
                                    value={regLastName}
                                    onChange={e => setRegLastName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-foreground">Correo electrónico</label>
                            <Input
                                type="email"
                                placeholder="correo@ejemplo.com"
                                required
                                value={regEmail}
                                onChange={e => setRegEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-foreground">Contraseña</label>
                            <PasswordInput
                                placeholder="Contraseña segura"
                                required
                                value={regPassword}
                                onChange={e => setRegPassword(e.target.value)}
                            />
                        </div>
                        <DialogFooter className="pt-3 flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsRegisterOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isRegistering}>
                                {isRegistering ? (
                                    <>
                                        <Loader2 className="animate-spin mr-1.5 h-4 w-4" />
                                        Creando cuenta...
                                    </>
                                ) : (
                                    'Crear cuenta'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
