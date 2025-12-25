
'use server';

import connectDB from '@/lib/db';
import User from '@/models/User';
import { login } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function registerAction(prevState, formData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    if (!name || !email || !password) {
        return { error: 'Please fill in all fields' };
    }

    await connectDB();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return { error: 'User already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    // Create session
    await login({ id: user._id.toString(), email: user.email, name: user.name });

    redirect('/');
}

export async function loginAction(prevState, formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
        return { error: 'Please provide email and password' };
    }

    await connectDB();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
        return { error: 'Invalid credentials' };
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return { error: 'Invalid credentials' };
    }

    // Create session
    await login({ id: user._id.toString(), email: user.email, name: user.name });

    redirect('/');
}
