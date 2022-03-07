import { DemoController } from './demo-controller';

describe('demo-controller', () => {
  let demoController: DemoController;

  beforeEach(() => {
    demoController = new DemoController();
  });

  it('should greet people', async () => {
    const name: string = 'Andy';
    expect(await demoController.greetings(name)).toBe(`Hello ${name}`);
  });
});
