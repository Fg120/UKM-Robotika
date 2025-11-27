import login from '@/routes/login';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import Silk from '@/components/Silk';

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center selection:bg-blue-500/30">
            <Head title="Masuk" />

            {/* Silk Background */}
            <div className="absolute inset-0 opacity-40">
                <Silk
                    speed={5}
                    scale={1.2}
                    color="#1A3D6D"
                    noiseIntensity={1.5}
                    rotation={0}
                />
            </div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950 pointer-events-none" />

            {/* Glass Card */}
            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
                    {/* Glow Effect */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <Link href="/" className="inline-block mb-6">
                                <div className="h-12 bg-white rounded-lg px-3 flex items-center justify-center">
                                    <img
                                        src="/asset/logo-panjang.png"
                                        alt="Logo Robotika"
                                        className="h-full w-auto object-contain"
                                    />
                                </div>
                            </Link>
                            <h1 className="text-2xl font-bold text-white mb-2">Selamat Datang Kembali</h1>
                            <p className="text-slate-400 text-sm">
                                Masukkan kredensial Anda untuk mengakses dashboard
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
                                {status}
                            </div>
                        )}

                        <Form {...login.store.form()} resetOnSuccess={['password']} className="flex flex-col gap-5">
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-slate-300">Alamat Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="admin@robotika.unej.ac.id"
                                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password" className="text-slate-300">Kata Sandi</Label>
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                                className="border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                            />
                                            <Label htmlFor="remember" className="text-slate-300 cursor-pointer">Ingat saya</Label>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white border-0 shadow-lg shadow-blue-500/20 py-6"
                                        tabIndex={4}
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <LoaderCircle className="h-5 w-5 animate-spin" />
                                        ) : (
                                            'Masuk'
                                        )}
                                    </Button>
                                </>
                            )}
                        </Form>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-xs">
                        &copy; {new Date().getFullYear()} UKM Robotika UNEJ. Akses Terbatas.
                    </p>
                </div>
            </div>
        </div>
    );
}
