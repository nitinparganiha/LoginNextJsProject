
import { getSession, logout } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient'; // We'll move client logic here

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">Security Dashboard</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                                {session.user.name} ({session.user.email})
                            </span>
                            <form action={async () => {
                                'use server';
                                await logout();
                                redirect('/login');
                            }}>
                                <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-500">
                                    Sign out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="py-10">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <DashboardClient />
                </div>
            </main>
        </div>
    );
}
