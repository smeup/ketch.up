import { KupEventPayload } from "../../types/GenericTypes";

export enum PaginatorMode {
    SIMPLE = 'simple',
    FULL = 'full',
}

export interface KupPaginatorPageChangedEventPayload extends KupEventPayload {
    newPage: number;
}

export interface KupPaginatorRowsPerPageChangedEventPayload extends KupEventPayload {
    newRowsPerPage: number;
}