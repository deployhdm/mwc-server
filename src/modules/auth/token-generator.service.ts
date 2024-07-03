import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenGeneratorService {
    constructor(private readonly authService: AuthService,    ){}

    async generateToken(email: string, password: string): Promise<string>{
        const signInResponse = await this.authService.signIn(email, password)
        return signInResponse.token
    }
}