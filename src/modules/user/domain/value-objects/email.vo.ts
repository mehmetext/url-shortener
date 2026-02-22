export class EmailVO {
  constructor(public readonly value: string) {
    if (!value.includes('@')) {
      throw new Error('Invalid email');
    }
  }
}
