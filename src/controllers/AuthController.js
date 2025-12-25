
import AuthService from '@/services/AuthService';
import UserRepository from '@/repositories/UserRepository';
import AuthValidator from '@/validators/AuthValidator';

class AuthController {
    constructor() {
        this.authService = new AuthService(new UserRepository());
        this.authValidator = new AuthValidator();
    }

    async register(formData) {
        try {
            const { name, email, password } = this.authValidator.validateRegister(formData);
            await this.authService.register(name, email, password);
            return { success: true };
        } catch (error) {
            return { error: error.message };
        }
    }

    async login(formData) {
        try {
            const { email, password } = this.authValidator.validateLogin(formData);
            await this.authService.login(email, password);
            return { success: true };
        } catch (error) {
            return { error: error.message };
        }
    }
}

export default AuthController;
