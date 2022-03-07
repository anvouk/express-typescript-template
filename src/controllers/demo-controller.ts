export class DemoController {
  public async greetings(name: string): Promise<string> {
    return `Hello ${name}`;
  }
}

export default new DemoController();
