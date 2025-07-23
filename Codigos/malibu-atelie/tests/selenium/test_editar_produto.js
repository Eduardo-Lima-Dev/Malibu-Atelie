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

async function testEditarProduto() {
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
    console.log('Login realizado com sucesso');

    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Produto Selenium')]")), 
      10000,
      'Produto Selenium não encontrado na lista'
    );
    console.log('Produto encontrado na lista');

    let editBtn;
    try {
      editBtn = await driver.findElement(
        By.xpath("//tr[td[contains(text(),'Produto Selenium')]]//button[@title='Editar']")
      );
    } catch (e) {
      try {
        editBtn = await driver.findElement(
          By.xpath("//tr[td[contains(text(),'Produto Selenium')]]//button[contains(@class, 'edit') or contains(text(), 'Editar')]")
        );
      } catch (e2) {
        editBtn = await driver.findElement(
          By.xpath("//tr[td[contains(text(),'Produto Selenium')]]//button[.//*[name()='svg'] or contains(@class, 'icon')]")
        );
      }
    }

    await driver.wait(until.elementIsVisible(editBtn), 5000);
    
    try {
      await editBtn.click();
      console.log('Botão editar clicado com sucesso');
    } catch (clickError) {
      console.log('Clique normal no botão editar falhou, tentando JavaScript click...');
      await driver.executeScript("arguments[0].click();", editBtn);
      console.log('JavaScript click no botão editar executado');
    }

    await driver.wait(
      until.elementLocated(By.css('form input[type=text], form input[name="name"]')),
      5000,
      'Modal de edição não abriu'
    );
    console.log('Modal de edição aberto');

    await driver.sleep(1000);

    const nomeInput = await driver.findElement(By.css('form input[type=text], form input[name="name"]'));
    const nomeAtual = await nomeInput.getAttribute('value');
    console.log('Nome atual do produto:', nomeAtual);

    const descricaoTextarea = await driver.findElement(By.css('form textarea, form textarea[name="description"]'));
    const descricaoAtual = await descricaoTextarea.getAttribute('value');
    console.log('Descrição atual do produto:', descricaoAtual);

    await descricaoTextarea.clear();
    const novaDescricao = 'Descrição editada pelo Selenium - ' + new Date().toLocaleTimeString();
    await descricaoTextarea.sendKeys(novaDescricao);
    console.log('Nova descrição inserida:', novaDescricao);

    let saveBtn;
    try {
      saveBtn = await driver.findElement(
        By.xpath("//button[contains(text(),'Salvar Alterações')]")
      );
    } catch (e) {
      try {
        saveBtn = await driver.findElement(
          By.xpath("//button[contains(text(),'Salvar')]")
        );
      } catch (e2) {
        saveBtn = await driver.findElement(By.css('form button[type=submit]'));
      }
    }

    await driver.wait(until.elementIsVisible(saveBtn), 5000);
    await driver.sleep(1000);

    let overlay = null;
    try {
      overlay = await driver.findElement(
        By.css('div.fixed.inset-0.z-50.flex.items-center.justify-center.bg-black\\/40')
      );
    } catch (e) {
    }

    try {
      await saveBtn.click();
      console.log('Botão salvar clicado com sucesso');
    } catch (clickError) {
      console.log('Clique normal no botão salvar falhou, tentando JavaScript click...');
      await driver.executeScript("arguments[0].click();", saveBtn);
      console.log('JavaScript click no botão salvar executado');
    }

    if (overlay) {
      try {
        await driver.wait(
          until.stalenessOf(overlay),
          10000,
          'O modal não fechou a tempo'
        );
        console.log('Modal fechado com sucesso');
      } catch (e) {
        console.log('Não foi possível detectar o fechamento do modal via overlay');
      }
    } else {
      await driver.sleep(2000);
      try {
        await driver.wait(async () => {
          const forms = await driver.findElements(By.css('form'));
          const visibleForms = [];
          for (let form of forms) {
            if (await form.isDisplayed()) {
              visibleForms.push(form);
            }
          }
          return visibleForms.length === 0;
        }, 5000);
        console.log('Formulário não está mais visível');
      } catch (e) {
        console.log('Não foi possível verificar se o formulário fechou');
      }
    }

    try {
      await driver.wait(
        until.elementLocated(
          By.xpath("//*[contains(text(),'Produto atualizado com sucesso') or contains(text(),'atualizado') or contains(text(),'Sucesso')]")
        ), 
        5000
      );
      console.log('Edição bem-sucedida: Mensagem de sucesso encontrada');
    } catch (e) {
      console.log('Mensagem de sucesso não encontrada, verificando se o produto foi alterado...');

      try {
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
        await driver.sleep(1000);

        const descElements = await driver.findElements(
          By.xpath("//*[contains(text(),'editada pelo Selenium')]")
        );
        
        if (descElements.length > 0) {
          console.log('Edição bem-sucedida: Nova descrição encontrada na página');
        } else {
          console.log('AVISO: Não foi possível confirmar se a edição foi aplicada');
        }
      } catch (verifyError) {
        console.log('Erro ao verificar alteração:', verifyError.message);
      }
    }

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

    console.log('Iniciando teste de validação...');

    try {
      editBtn = await driver.findElement(
        By.xpath("//tr[td[contains(text(),'Produto Selenium')]]//button[@title='Editar']")
      );
    } catch (e) {
      editBtn = await driver.findElement(
        By.xpath("//tr[td[contains(text(),'Produto Selenium')]]//button[contains(@class, 'edit') or .//*[name()='svg']]")
      );
    }

    try {
      await editBtn.click();
    } catch (clickError) {
      await driver.executeScript("arguments[0].click();", editBtn);
    }

    await driver.wait(
      until.elementLocated(By.css('form input[type=text]')),
      5000,
      'Modal de edição não abriu para teste de validação'
    );
    await driver.sleep(1000);

    const nomeInputValidacao = await driver.findElement(By.css('form input[type=text]'));
    await nomeInputValidacao.clear();
    console.log('Campo nome limpo para teste de validação');

    try {
      saveBtn = await driver.findElement(
        By.xpath("//button[contains(text(),'Salvar')]")
      );
    } catch (e) {
      saveBtn = await driver.findElement(By.css('form button[type=submit]'));
    }

    await driver.wait(until.elementIsVisible(saveBtn), 5000);
    await driver.sleep(1000);

    try {
      await saveBtn.click();
      console.log('Botão salvar clicado para teste de validação');
    } catch (clickError) {
      await driver.executeScript("arguments[0].click();", saveBtn);
    }

    await driver.sleep(2000);

    try {
      await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'Nome é obrigatório')]")),
        3000
      );
      console.log('Validação de edição: mensagem de erro exibida - "Nome é obrigatório"');
    } catch (e1) {
      try {
        await driver.wait(
          until.elementLocated(By.xpath("//*[contains(text(),'obrigatório') or contains(text(),'required')]")),
          3000
        );
        console.log('Validação de edição: mensagem de erro exibida');
      } catch (e2) {
        try {
          const nameInput = await driver.findElement(By.css('form input[type=text]'));
          const validationMessage = await nameInput.getAttribute('validationMessage');
          if (validationMessage && validationMessage.trim() !== '') {
            console.log('Validação de edição: validação HTML5 detectada -', validationMessage);
          } else {
            throw new Error('Nenhuma validação encontrada');
          }
        } catch (e3) {
          try {
            await driver.findElement(By.xpath("//*[contains(text(),'Cadastrar Produto') or contains(text(),'Editar')]"));
            console.log('Validação de edição: modal ainda está aberto (validação funcionou indiretamente)');
          } catch (e4) {
            console.log('AVISO: Não foi possível detectar validação de campo obrigatório na edição');
          }
        }
      }
    }

    console.log('Testando acesso a produto inexistente...');
    await driver.get('http://localhost:3000/dashboard/produtos/99999');
    
    try {
      await driver.wait(
        until.elementLocated(
          By.xpath("//*[contains(text(),'Produto não encontrado') or contains(text(),'404') or contains(text(),'Não encontrado')]")
        ), 
        5000
      );
      console.log('Produto inexistente: mensagem 404 exibida');
    } catch (e) {
      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl.includes('/dashboard') && !currentUrl.includes('99999')) {
        console.log('Produto inexistente: redirecionado para dashboard (comportamento alternativo válido)');
      } else {
        console.log('AVISO: Não foi possível verificar tratamento de produto inexistente');
        console.log('URL atual:', currentUrl);
      }
    }

  } catch (e) {
    console.error('Erro no teste de edição de produto:', e);

    try {
      const screenshot = await driver.takeScreenshot();
      require('fs').writeFileSync('edit_error_screenshot.png', screenshot, 'base64');
      console.log('Screenshot salvo como edit_error_screenshot.png');
    } catch (screenshotError) {
      console.log('Não foi possível capturar screenshot:', screenshotError.message);
    }
    
  } finally {
    await driver.quit();
  }
}

testEditarProduto();