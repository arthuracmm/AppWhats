const { iniciarNavegador, coletarMensagens } = require('./scraper');
const { salvarMensagens } = require('./db');

(async () => {
    const page = await iniciarNavegador();
    const contatosComMensagens = await coletarMensagens(page);

    for (const contato of contatosComMensagens) {
        await salvarMensagens(contato.nome, contato.mensagens);
    }

    await page.close();
    console.log('Dados puxados com sucesso');
})();
