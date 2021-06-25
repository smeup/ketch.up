/**
 * Interface of the objects JSON.
 * << To be implemented, still a draft. >>
 */
export interface KupObjectsJSON {
    [index: string]: any;
}
/**
 * The composition of an object consists of: type, parameter, key.
 */
export interface KupObj {
    t: string;
    p: string;
    k: string;
}
