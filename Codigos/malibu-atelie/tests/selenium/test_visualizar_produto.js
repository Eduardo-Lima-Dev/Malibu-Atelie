const { Builder, By, until } = require('selenium-webdriver');

async function testVisualizarProduto() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {

    await driver.get('http://localhost:3000/');

    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Saida de banho') or contains(text(),'Toast teste')]")), 5000);
    await driver.findElement(By.xpath("//*[contains(text(),'Saida de banho') or contains(text(),'Toast teste')]")).click();
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Descrição') or contains(text(),'Saida de banho') or contains(text(),'Toast teste')]")), 5000);
    await driver.wait(until.elementLocated(By.css('img')));
    console.log('Visualização de produto existente: SUCESSO');

    await driver.get('http://localhost:3000/produtos/49');
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'This page could not be found')]")), 5000);
    console.log('Produto não encontrado: mensagem 404 exibida');
  } catch (e) {
    console.error('Erro no teste de visualização de produto:', e);
  } finally {
    await driver.quit();
  }
}

testVisualizarProduto(); 