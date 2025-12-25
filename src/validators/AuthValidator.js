
class AuthValidator {
    validateRegister(formData) {
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');

        if (!name || !email || !password) {
            throw new Error('Please fill in all fields');
        }

        return { name, email, password };
    }

    validateLogin(formData) {
        const email = formData.get('email');
        const password = formData.get('password');

        if (!email || !password) {
            throw new Error('Please provide email and password');
        }

        return { email, password };
    }
}

export default AuthValidator;
