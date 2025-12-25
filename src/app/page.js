
import Link from 'next/link';
import { getSession, logout } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getSession();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left">
        <h1 className="text-4xl font-bold">Next.js Mongo Auth</h1>

        {session ? (
          <div className="space-y-4">
            <div className="text-lg">
              Welcome back, <span className="font-bold text-green-600">{session.user.name}</span>!
            </div>
            <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
              <p>Email: {session.user.email}</p>
              <p>User ID: {session.user.id}</p>
            </div>

            <form action={async () => {
              'use server';
              await logout();
              redirect('/');
            }}>
              <button
                type="submit"
                className="px-6 py-2 text-white bg-red-600 rounded-full hover:bg-red-700 transition"
              >
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-xl">You are not logged in.</p>
            <div className="flex gap-4 flex-col sm:flex-row">
              <Link
                href="/login"
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
