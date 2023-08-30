export class GetTenantsRequestDto {
  username!: string;
  password!: string;
}

export class GetTenantsResponseItemDto {
  tenant_id!: string;
  company_id!: string;
  company_name!: string;
}

export type GetTenantsResponseDto = GetTenantsResponseItemDto[];
