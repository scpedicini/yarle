class SymmetricHash {
  private readonly hashSideA: { [key: string]: string };
  private readonly hashSideB: { [key: string]: string };

  constructor() {
    this.hashSideA = { };
    this.hashSideB = { };
  }

  clear(): void {
    for(const key in this.hashSideA) {
      delete this.hashSideA[key];
    }
    for(const key in this.hashSideB) {
      delete this.hashSideB[key];
    }
  }

  getAsEntries(): [key: string, value: string][] {
    return Object.entries(this.hashSideA);
  }

  containsKey(key: string): boolean {
    return this.hashSideA[key] !== undefined;
  }

  containsValue(value: string): boolean {
    return this.hashSideB[value] !== undefined;
  }

  containsKeyOrValue(keyOrValue: string): boolean {
    return this.containsKey(keyOrValue) || this.containsValue(keyOrValue);
  }

  get length(): number {
    return Object.keys(this.hashSideA).length;
  }

  insert(key: string, value: string): void {
    this.hashSideA[key] = value;
    this.hashSideB[value] = key;
  }

  get(key: string): string {
    return this.hashSideA[key];
  }

  removeKey(key: string): void {
    const value = this.hashSideA[key];
    delete this.hashSideA[key];
    delete this.hashSideB[value];
  }

  removeValue(value: string): void {
    const key = this.hashSideB[value];
    delete this.hashSideA[key];
    delete this.hashSideB[value];
  }
}

export { SymmetricHash };
