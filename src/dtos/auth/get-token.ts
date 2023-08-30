export class GetTokenRequestDto {
  grant_type: 'password' | 'refresh_token' = 'password';
  username!: string;
  password!: string;
  tenant_id!: string;
  company_id!: string;
  refresh_token?: string;
}

export class GetTokenResponseDto {
  access_token!: string;
  refreshToken!: string;
  expires_in!: number;
  token_type!: string;
  refresh_expires_in!: number;
}
