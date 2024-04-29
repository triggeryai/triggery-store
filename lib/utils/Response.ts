// W pliku utils/Response.ts
export interface Response {
    json(data: any, options?: { status?: number }): void;
  }
  