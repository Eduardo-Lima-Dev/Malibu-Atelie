const { Builder, By, until } = require('selenium-webdriver');

async function testLogin() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('http://localhost:3000/login');
    await driver.findElement(By.css('input[type=email]')).sendKeys('dudu@email.com');
    await driver.findElement(By.css('input[type=password]')).sendKeys('123456');
    await driver.findElement(By.css('button[type=submit]')).click();
    await driver.wait(until.urlContains('/dashboard'), 5000);
    console.log('Login bem-sucedido: SUCESSO');

    await driver.get('http://localhost:3000/login');
    await driver.findElement(By.css('input[type=email]')).sendKeys('dudu@email.com');
    await driver.findElement(By.css('input[type=password]')).sendKeys('senhaErrada');
    await driver.findElement(By.css('button[type=submit]')).click();
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Senha incorreta')]")), 5000);
    console.log('Login inválido: mensagem de erro exibida');
  } catch (e) {
    console.error('Erro no teste de login:', e);
  } finally {
    await driver.quit();
  }
}

testLogin(); 