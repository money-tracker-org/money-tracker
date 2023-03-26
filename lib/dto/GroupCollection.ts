import { IsArray, IsOptional, IsString } from "class-validator"

export class RegisteredGroup {
    @IsString()
    groupId: string

    @IsOptional()
    asUserId: string | null
}

export class GroupCollection {
    @IsArray()
    // @ValidateNested()
    groups: RegisteredGroup[]
}

