import UserRepository from "../repositories/UserRepository";

class UserService {
    async createUser(userData: any) {
        try {
            const newUser = await UserRepository.createUser(userData);
            return newUser;
        } catch (error) {
            throw new Error("Error creating user");
        }
    }
}

export default new UserService();
