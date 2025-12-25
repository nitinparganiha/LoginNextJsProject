
import bcrypt from 'bcryptjs';
import database from '@/lib/Database';
import { login } from '@/lib/auth';

class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async register(name, email, password) {
        await database.connect();

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        await login({ id: user._id.toString(), email: user.email, name: user.name });
        return user;
    }

    async login(email, password) {
        await database.connect();

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        await login({ id: user._id.toString(), email: user.email, name: user.name });
        return user;
    }
}

export default AuthService;
