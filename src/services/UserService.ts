import bcrypt from "bcrypt";
import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async getUserById(id: string) {
    return this.userRepository.findById(id);
  }

  async createUser(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
  }

  async updateUser(id: string, userData: any) {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    return this.userRepository.update(id, userData);
  }

  async deleteUser(id: string) {
    return this.userRepository.delete(id);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("Usuario no encontrado");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error("La contraseña actual no es correcta.");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updatePassword(userId, hashedPassword);

    return { message: "Contraseña actualizada correctamente." };
  }

}
