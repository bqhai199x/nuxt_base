import bcrypt from 'bcryptjs'
import { prisma } from './prisma.service'
import { BCRYPT_SALT_ROUNDS } from '~/shared/constants'
import type { CreateUserInput, User, UserResponse } from '~/shared/types'

// User service for database operations
export class UserService {
  private static instance: UserService

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  // Get all users
  async getUsers(): Promise<UserResponse[]> {
    return await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  // Get user by ID
  async getUserById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      }
    })
  }

  // Get user by username (without password)
  async getUserByUsername(username: string): Promise<UserResponse | null> {
    return await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        role: true
      }
    })
  }

  // Create new user
  async createUser(data: CreateUserInput): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS)
    
    return await prisma.user.create({
      data: {
        username: data.username,
        name: data.name,
        password: hashedPassword
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true
      }
    })
  }


  // Verify password for authentication
  async verifyPassword(username: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { username }
    })
    
    if (!user || !user.isActive) return null
    
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return null
    
    return user as User
  }

  // Check if user exists by username
  async userExists(username: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true }
    })
    return !!user
  }

  // Get user count
  async getUserCount(): Promise<number> {
    return await prisma.user.count()
  }

  // Get active users count
  async getActiveUserCount(): Promise<number> {
    return await prisma.user.count({
      where: { isActive: true }
    })
  }

  // Deactivate user (soft delete)
  async deactivateUser(id: number): Promise<UserResponse> {
    return await prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })
  }

  // Activate user
  async activateUser(id: number): Promise<UserResponse> {
    return await prisma.user.update({
      where: { id },
      data: { isActive: true },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })
  }

  // Change password
  async changePassword(id: number, newPassword: string): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS)
    
    return await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })
  }
}

export const userService = UserService.getInstance()
