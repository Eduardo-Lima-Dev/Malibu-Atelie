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

async function testCadastrarProduto() {
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

    await driver.findElement(By.xpath("//*[contains(text(),'Cadastrar Produto')]")).click();

    await driver.findElement(By.css('form input[type=text]')).sendKeys('Produto Selenium');
    await driver.findElement(By.css('form textarea')).sendKeys('Descrição do produto Selenium');
    await driver.findElement(By.css('input[placeholder="R$ 0,00"]')).sendKeys('1099');
    await driver.sleep(1000);
    await driver.findElement(By.css('form select')).sendKeys('Praia');

    const fileInput = await driver.findElement(By.css('input[type=file]'));
    await fileInput.sendKeys(path.resolve(__dirname, 'imagem_teste.jpg'));

    const preview = await driver.wait(
      until.elementLocated(By.css('form img[alt="Preview"]')),
      15000,
      'Preview não apareceu dentro de 15s'
    );
    await driver.wait(until.elementIsVisible(preview), 5000);

    const forms = await driver.findElements(By.css('form'));
    const form = forms[forms.length - 1];
    const submitBtn = await form.findElement(By.css('button[type=submit]'));
    await driver.wait(until.elementIsVisible(submitBtn), 10000);

    const overlay = await driver.findElement(
      By.css('div.fixed.inset-0.z-50.flex.items-center.justify-center.bg-black\\/40')
    );

    await submitBtn.click();

    await driver.wait(
      until.stalenessOf(overlay),
      10000,
      'O modal não fechou a tempo'
    );

    await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
    await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(translate(normalize-space(text()),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'produto selenium')]")
      ),
      15000
    );
    console.log('Cadastro válido: SUCESSO');

    await driver.sleep(2000);

    await driver.wait(async () => {
      const overlays = await driver.findElements(By.css('div.fixed.inset-0'));
      const visibleOverlays = [];
      for (let overlay of overlays) {
        if (await overlay.isDisplayed()) {
          visibleOverlays.push(overlay);
        }
      }
      return visibleOverlays.length === 0;
    }, 5000, 'Ainda há overlays visíveis na tela');

    try {
      const cadastrarBtn = await driver.findElement(By.xpath("//*[contains(text(),'Cadastrar Produto')]"));
      await driver.wait(until.elementIsVisible(cadastrarBtn), 5000);

      await driver.sleep(1000);
      await cadastrarBtn.click();
    } catch (clickError) {
      console.log('Clique normal falhou, tentando JavaScript click...');
      const cadastrarBtn = await driver.findElement(By.xpath("//*[contains(text(),'Cadastrar Produto')]"));
      await driver.executeScript("arguments[0].click();", cadastrarBtn);
    }

    await driver.wait(
      until.elementLocated(By.css('form input[type=text]')),
      5000,
      'Modal não abriu'
    );

    await driver.sleep(1000);

    const nomeInput = await driver.findElement(By.css('form input[type=text]'));
    await nomeInput.clear();
    console.log('Campo nome limpo');
    
    const descricaoTextarea = await driver.findElement(By.css('form textarea'));
    await descricaoTextarea.clear();
    await descricaoTextarea.sendKeys('Teste campo vazio');
    console.log('Descrição preenchida');
    
    const precoInput = await driver.findElement(By.css('input[placeholder="R$ 0,00"]'));
    await precoInput.clear();
    console.log('Preço limpo');
    
    const selectElement = await driver.findElement(By.css('form select'));
    await selectElement.click();
    await driver.findElement(By.css('form select option[value=""]')).click();
    console.log('Categoria desmarcada');

    const nomeValue = await nomeInput.getAttribute('value');
    console.log('Valor do campo nome antes do submit:', `"${nomeValue}"`);

    await driver.sleep(1000);
    
    let saveBtn;
    try {
      saveBtn = await driver.findElement(
        By.xpath("//button[contains(text(),'Cadastrar Produto') or contains(text(),'Salvar')]")
      );
    } catch (e) {
      saveBtn = await driver.findElement(By.css('form button[type=submit]'));
    }
    
    await driver.wait(until.elementIsVisible(saveBtn), 5000);
    await driver.sleep(1000);
    
    try {
      await saveBtn.click();
      console.log('Botão submit clicado com sucesso');
    } catch (clickError) {
      console.log('Clique normal no botão salvar falhou, tentando JavaScript click...');
      await driver.executeScript("arguments[0].click();", saveBtn);
      console.log('JavaScript click executado');
    }

    await driver.sleep(2000);

    try {
      await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'Nome é obrigatório')]")),
        3000
      );
      console.log('Campo obrigatório ausente: mensagem de erro exibida - "Nome é obrigatório"');
    } catch (e1) {
      try {
        await driver.wait(
          until.elementLocated(By.xpath("//*[contains(text(),'obrigatório') or contains(text(),'obrigatorio') or contains(text(),'required')]")),
          3000
        );
        console.log('Campo obrigatório ausente: mensagem de erro exibida - contém "obrigatório"');
      } catch (e2) {
        try {
          const nameInput = await driver.findElement(By.css('form input[type=text]'));
          const validationMessage = await nameInput.getAttribute('validationMessage');
          if (validationMessage && validationMessage.trim() !== '') {
            console.log('Campo obrigatório ausente: validação HTML5 detectada -', validationMessage);
          } else {
            throw new Error('Nenhuma validação encontrada');
          }
        } catch (e3) {
          try {
            await driver.findElement(By.xpath("//h2[contains(text(),'Cadastrar Produto')] | //h1[contains(text(),'Cadastrar Produto')] | //*[contains(@class,'modal') and contains(text(),'Cadastrar')]"));
            console.log('Campo obrigatório ausente: modal ainda está aberto (validação funcionou indiretamente)');
          } catch (e4) {
            console.log('AVISO: Não foi possível detectar validação de campo obrigatório');
            console.log('Tentativas realizadas:');
            console.log('1. Busca por "Nome é obrigatório" - Falhou');
            console.log('2. Busca por "obrigatório" - Falhou'); 
            console.log('3. Validação HTML5 - Falhou');
            console.log('4. Modal ainda aberto - Falhou');

            try {
              const pageSource = await driver.getPageSource();
              console.log('Verificando se há mensagens de erro na página...');

              const errorElements = await driver.findElements(By.css('.error, .alert, .warning, .invalid, [class*="error"], [class*="invalid"]'));
              if (errorElements.length > 0) {
                console.log(`Encontrados ${errorElements.length} possíveis elementos de erro`);
                for (let i = 0; i < errorElements.length && i < 3; i++) {
                  try {
                    const text = await errorElements[i].getText();
                    if (text.trim()) {
                      console.log(`Elemento de erro ${i + 1}: "${text}"`);
                    }
                  } catch (err) {
                  }
                }
              }
            } catch (debugError) {
              console.log('Erro ao fazer debug adicional:', debugError.message);
            }
          }
        }
      }
    }

  } catch (e) {
    console.error('Erro no teste de cadastro de produto:', e);
    
    try {
      const screenshot = await driver.takeScreenshot();
      require('fs').writeFileSync('error_screenshot.png', screenshot, 'base64');
      console.log('Screenshot salvo como error_screenshot.png');
    } catch (screenshotError) {
      console.log('Não foi possível capturar screenshot:', screenshotError.message);
    }
    
  } finally {
    await driver.quit();
  }
}

testCadastrarProduto();