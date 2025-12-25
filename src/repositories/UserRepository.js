
import User from '@/models/User';

class UserRepository {
    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async create(userData) {
        return await User.create(userData);
    }

    async findById(id) {
        return await User.findById(id);
    }
}

export default UserRepository;
