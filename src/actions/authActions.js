
'use server';

import AuthController from '@/controllers/AuthController';
import { redirect } from 'next/navigation';

const authController = new AuthController();

export async function registerAction(prevState, formData) {
    const result = await authController.register(formData);

    if (result.error) {
        return { error: result.error };
    }

    redirect('/dashboard');
}

export async function loginAction(prevState, formData) {
    const result = await authController.login(formData);

    if (result.error) {
        return { error: result.error };
    }

    redirect('/dashboard');
}
