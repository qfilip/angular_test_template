import { Observable } from "rxjs";
import { CachedData, CacheFunctions } from "./cache.models";

export abstract class CacheService {
    public abstract register<T>(key: string, fetchFn: () => Observable<T>, expiresAfter: number): CacheFunctions<T>;
    protected abstract retrieve<T>(key: string, expiresAfter: number, fetchFn: () => Observable<T>): Observable<T>;
    protected abstract clear(key: string): void;
    protected abstract getCache(key: string): CachedData;
    protected abstract setCache<T>(key: string, data: T, expiresAfter: number): void;

    protected hasExpired(key: string): boolean {
        const now = new Date().getTime();
        const cache = this.getCache(key);
        
        return (cache.expiresAt) <= now;
    }
}