const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

let options = new chrome.Options();
options.addArguments('--disable-save-password-bubble');
options.addArguments('--disable-features=PasswordChangeInSettings,PasswordCheck,PasswordLeakDetection');
options.addArguments('--incognito');
options.setUserPreferences({
  'credentials_enable_service': false,
  'profile.password_manager_enabled': false
});

async function testExcluirProduto() {
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {

    await driver.get('http://localhost:3000/login');
    await driver.findElement(By.css('input[type=email]')).sendKeys('dudu@email.com');
    await driver.findElement(By.css('input[type=password]')).sendKeys('123456');
    await driver.findElement(By.css('button[type=submit]')).click();
    await driver.wait(until.urlContains('/dashboard'), 5000);

    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Produto Selenium')]")),
      10000,
      'Produto Selenium não apareceu na listagem'
    );

    let deleteBtn;
    try {
      deleteBtn = await driver.findElement(
        By.xpath("//tr[td[contains(text(),'Produto Selenium')]]//button[@title='Excluir']")
      );
    } catch {

      deleteBtn = await driver.findElement(
        By.xpath("//tr[td[contains(text(),'Produto Selenium')]]//button[.//*[name()='svg' and (contains(@class,'trash') or contains(@aria-label,'trash'))]]")
      );
    }
    await driver.wait(until.elementIsVisible(deleteBtn), 5000);
    await driver.executeScript("arguments[0].scrollIntoView(true);", deleteBtn);
    await deleteBtn.click();

    const confirmBtn = await driver.wait(
      until.elementLocated(
        By.xpath("//div[contains(@class,'bg-white') and .//button[contains(text(),'Excluir')]]//button[contains(text(),'Excluir')]")
      ),
      5000,
      'Botão de confirmação "Excluir" não apareceu'
    );
    await driver.wait(until.elementIsVisible(confirmBtn), 5000);

    await confirmBtn.click();

    await driver.wait(async () => {
      const rows = await driver.findElements(
        By.xpath("//tr[td[contains(text(),'Produto Selenium')]]")
      );
      return rows.length === 0;
    }, 10000, 'Produto Selenium ainda está na lista após exclusão');

    console.log('Exclusão confirmada: SUCESSO');

  } catch (e) {
    console.error('Erro no teste de exclusão de produto:', e);
    try {
      const screenshot = await driver.takeScreenshot();
      require('fs').writeFileSync('excluir_error_screenshot.png', screenshot, 'base64');
      console.log('Screenshot salvo como excluir_error_screenshot.png');
    } catch {}
  } finally {
    await driver.quit();
  }
}

testExcluirProduto();
