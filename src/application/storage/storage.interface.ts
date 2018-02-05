export interface IStorage {
    get(name: string): Promise<any>;
    set(name: string, data: any): Promise<void>;
}

export const TStorage = 'IStorage';