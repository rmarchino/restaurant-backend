import { AppDataSource } from "../config/data-source";
import { Repository } from "typeorm";
import { User } from "../models/User";

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await this.repository.findOne({
        where: { id },
        relations: ["sede", "roles"],
      });
    } catch (error) {
      console.error("Error al buscar usuario por ID:", error);
      throw new Error("Error al obtener usuario por ID");
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.repository.findOne({
        where: { email },
        relations: ["sede", "roles"],
      });
    } catch (error) {
      console.error("Error al buscar usuario por email:", error);
      throw new Error("Error al obtener usuario por email");
    }
  }

  async findAll(skip = 0, take = 20): Promise<User[]> {
    try {
      return await this.repository.find({
        skip,
        take,
        order: { id: "DESC" },
      });
    } catch (error) {
      console.error("Error al listar usuarios:", error);
      throw new Error("Error al obtener usuarios");
    }
  }

  async create(userData: Partial<User>): Promise<User> {
    try {
      const user = this.repository.create(userData);
      return await this.repository.save(user);
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw new Error("Error al crear usuario");
    }
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    try {
      const user = await this.findById(id);
      if (!user) return null;

      Object.assign(user, data);
      return await this.repository.save(user);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw new Error("Error al actualizar usuario");
    }
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    try {
      await this.repository.update(id, { password: hashedPassword });
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      throw new Error("Error al actualizar contraseña");
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected !== 0;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw new Error("Error al eliminar usuario");
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const count = await this.repository.count({ where: { email } });
      return count > 0;
    } catch (error) {
      console.error("Error al verificar email:", error);
      throw new Error("Error al verificar email");
    }
  }
}
