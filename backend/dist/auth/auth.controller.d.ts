import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: {
        identifier: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            phone: any;
            role: any;
        };
    }>;
    register(registerDto: {
        name: string;
        email?: string;
        phone?: string;
        password: string;
    }): Promise<{
        id: string;
        email: string;
        phone: string;
        name: string;
        role: string;
        createdAt: Date;
    }>;
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        phone: string;
        name: string;
        role: string;
        createdAt: Date;
    }>;
}
