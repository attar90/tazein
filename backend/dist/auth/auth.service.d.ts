import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(identifier: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            phone: any;
            role: any;
        };
    }>;
    register(userData: {
        name: string;
        email?: string;
        phone?: string;
        password: string;
        role?: string;
    }): Promise<{
        id: string;
        email: string;
        phone: string;
        name: string;
        role: string;
        createdAt: Date;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        phone: string;
        name: string;
        role: string;
        createdAt: Date;
    }>;
}
