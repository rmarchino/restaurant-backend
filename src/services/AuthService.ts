import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import type { StringValue } from "ms";
import { User } from "../models/User";
import { Role } from "../models/Role";
import { Sede } from "../models/Sede";
import { CreateUserDto } from "../dtos/user.dto";
import { AppDataSource } from "../config/data-source";
import { UserStatus } from "../enums/UserStatus.enum";

const JWT_SECRET: Secret =
  process.env.JWT_SECRET || "mi_jwt_secreto_muy_seguro";
const JWT_EXPIRES_IN: StringValue =
  (process.env.JWT_EXPIRES_IN as StringValue) || "1h";

export class AuthService {
  private userRepository: Repository<User>;
  private roleRepository: Repository<Role>;
  private sedeRepository: Repository<Sede>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.roleRepository = AppDataSource.getRepository(Role);
    this.sedeRepository = AppDataSource.getRepository(Sede);
  }

  // Generar un token JWT
  public generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      rol: user.role?.nombre || 'Administrador',
      sede_id: user.sede_id
    };

    const options: SignOptions = {
      expiresIn: JWT_EXPIRES_IN,
    };

    return jwt.sign(payload, JWT_SECRET, options);
  }

  // Lógica de Registro de Usuario
  async register(
    userData: CreateUserDto
  ): Promise<{ user: Omit<User, "password">; token: string }> {
    const { email, password, rol_id, sede_id, estado, ...rest } = userData;

    // 1️. Verificar si existe el email
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new Error("El correo electrónico ya está en uso.");
    }

    // 2️. Verificación de Rol
    const role = await this.roleRepository.findOneBy({ id: rol_id });
    if (!role) {
      throw new Error(`Rol con ID ${rol_id} no encontrado.`);
    }

    // 3️. Verificación de Sede
    const sede = await this.sedeRepository.findOneBy({ id: sede_id });
    if (!sede) {
      throw new Error(`Sede con ID ${sede_id} no encontrada.`);
    }

    // 4️. Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️. Determinar estado del usuario
    const userStatusValue = estado
      ? UserStatus[estado.toUpperCase() as keyof typeof UserStatus]
      : UserStatus.ACTIVO;

    // 6️. Crear instancia y asignar relaciones por ID
    const newUser = this.userRepository.create({
      ...rest,
      email,
      password: hashedPassword,
      rol_id,
      sede_id,
      estado: userStatusValue,
    });

    // 7️. Guardar en la base de datos
    const savedUser = await this.userRepository.save(newUser);

    // 8️. Generar token JWT
    const token = this.generateToken(savedUser);

    // 9️. Retornar el usuario sin contraseña y el token
    const { password: _, ...userWithoutPassword } = savedUser;
    return { user: userWithoutPassword, token };
  }

  // Lógica de login
  async login(email: string, password: string): Promise<{ user: Omit<User, "password">; token: string }> {

    // 1. Buscar usuario por email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error("Correo o contraseña incorrectos.");
    }

    // 2. Verificar estado del usuario
    if (user.estado !== UserStatus.ACTIVO) {
      throw new Error("El usuario está inactivo.");
    }

    // 3. Comparar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Correo o contraseña incorrectos.");
    }

    // 4. Generar token JWT
    const token = this.generateToken(user);

    // 5. Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

}
