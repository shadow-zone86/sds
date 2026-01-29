type Token = string | symbol;

type Factory<T> = () => T;

class DIContainer {
  private singletons = new Map<Token, unknown>();
  private factories = new Map<Token, Factory<unknown>>();

  registerSingleton<T>(token: Token, instance: T): void {
    this.singletons.set(token, instance);
  }

  registerFactory<T>(token: Token, factory: Factory<T>): void {
    this.factories.set(token, factory as Factory<unknown>);
  }

  resolve<T>(token: Token): T | undefined {
    if (this.singletons.has(token)) return this.singletons.get(token) as T;
    const factory = this.factories.get(token);
    if (factory) return factory() as T;
    return undefined;
  }

  clear(): void {
    this.singletons.clear();
    this.factories.clear();
  }
}

export const container = new DIContainer();

export const createToken = (description: string): Token => Symbol.for(description);

export function resolveOr<T>(token: Token, fallbackFactory: () => T): T {
  const resolved = container.resolve<T>(token);
  return resolved !== undefined ? resolved : fallbackFactory();
}

export function resolveRequired<T>(token: Token, errorMessage?: string): T {
  const resolved = container.resolve<T>(token);
  if (resolved === undefined) {
    throw new Error(
      errorMessage ?? `DI: dependency not found for token "${String(token)}"`
    );
  }
  return resolved;
}
