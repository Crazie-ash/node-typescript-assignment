export interface BaseEntity {
    id: string;
    createdAt: Date;
    createdBy: string;
    isActive: boolean;
    isDeleted: boolean;
}