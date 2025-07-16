import { PrismaClient } from '@prisma/client'

// Singleton Prisma client
class PrismaService {
  private static instance: PrismaClient
  private constructor() {}

  static getInstance(): PrismaClient {
    if (!PrismaService.instance) {
      if (process.env.NODE_ENV === 'production') {
        PrismaService.instance = new PrismaClient()
      } else {
        // In development, use global to avoid creating multiple instances
        const globalForPrisma = globalThis as unknown as {
          prisma: PrismaClient | undefined
        }
        
        if (!globalForPrisma.prisma) {
          globalForPrisma.prisma = new PrismaClient()
        }
        
        PrismaService.instance = globalForPrisma.prisma
      }
    }
    return PrismaService.instance
  }

  // Graceful shutdown
  static async disconnect(): Promise<void> {
    if (PrismaService.instance) {
      await PrismaService.instance.$disconnect()
    }
  }
}

export const prisma = PrismaService.getInstance()
export default PrismaService
