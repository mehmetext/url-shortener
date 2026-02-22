export class UrlVO {
  constructor(public readonly value: string) {
    if (!value.startsWith('http')) {
      throw new Error('Invalid URL');
    }
  }
}
