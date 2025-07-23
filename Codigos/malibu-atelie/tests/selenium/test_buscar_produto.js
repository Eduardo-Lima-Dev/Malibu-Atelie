const { Builder, By, until } = require('selenium-webdriver');

async function testBuscarProduto() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {

    await driver.get('http://localhost:3000/catalogo');

    await driver.findElement(By.css('input[placeholder*="Buscar"]')).sendKeys('Sigflow');
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Sigflow')]")), 5000);
    console.log('Busca com resultados: SUCESSO');

    let inputBusca = await driver.findElement(By.css('input[placeholder*="Buscar"]'));
    await inputBusca.clear();
    await inputBusca.sendKeys('xyz123');
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Produto não existe')]")), 5000);
    console.log('Busca sem resultados: mensagem exibida');
  } catch (e) {
    console.error('Erro no teste de busca de produto:', e);
  } finally {
    await driver.quit();
  }
}

testBuscarProduto(); 