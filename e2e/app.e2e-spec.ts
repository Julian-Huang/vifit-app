import { VifitAppPage } from './app.po';

describe('vifit-app App', () => {
  let page: VifitAppPage;

  beforeEach(() => {
    page = new VifitAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
