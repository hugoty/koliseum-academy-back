import User from "../models/User";

class UserRepository {
    async createUser(userData: any) {
        try {
            const newUser = await User.create(userData);
            return newUser;
        } catch (error) {
            throw new Error("Error creating user");
        }
    }
}

export default new UserRepository();
