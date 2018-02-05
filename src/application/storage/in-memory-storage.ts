import { Component } from '@nestjs/common';
import { IStorage } from './storage.interface';

@Component()
export class InMemoryStorage implements IStorage {
    private storage: Map<string, any> = new Map();

    async get(name: string): Promise<any> {
        return this.storage.get(name);
    }

    async set(name: string, data: any): Promise<void> {
        this.storage.set(name, data);
    }

}