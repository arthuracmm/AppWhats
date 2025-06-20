const puppeteer = require('puppeteer');
const db = require('./database'); // se quiser separar a conexão SQLite
let browser, page;

async function iniciarWhatsApp() {
    if (!browser) {
        browser = await puppeteer.launch({
            headless: false,
            userDataDir: './whatsapp-session',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: null
        });
        const pages = await browser.pages();
        page = pages[0];
        await page.goto('https://web.whatsapp.com', { waitUntil: 'networkidle2' });
        console.log('WhatsApp iniciado.');
    }
    return page;
}

function getHorarioFormatado() {
  const agora = new Date();
  const mm = String(agora.getMonth() + 1); 
  const dd = String(agora.getDate());
  const yyyy = agora.getFullYear();

  const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return `[${hora}, ${mm}/${dd}/${yyyy}]`;
}
async function enviarMensagem(contato, mensagem) {
    const page = await iniciarWhatsApp();

    const searchSelector = 'div[role="textbox"][contenteditable="true"][aria-label="Caixa de texto de pesquisa"][data-tab="3"]';
    const messageInputSelector = 'div[role="textbox"][contenteditable="true"][aria-label="Digite uma mensagem"][data-tab="10"]';

    await page.waitForSelector(searchSelector);
    await page.click(searchSelector);
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type(searchSelector, contato);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const contatoSelector = `span[title="${contato}"]`;
    await page.waitForSelector(contatoSelector);
    await page.click(contatoSelector);
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.waitForSelector(messageInputSelector);
    await page.type(messageInputSelector, mensagem);
    await page.keyboard.press('Enter');

    const horario = getHorarioFormatado();

    db.run(
        'INSERT INTO mensagens (contato, remetente, horario, texto) VALUES (?, ?, ?, ?)',
        [contato, 'Você', horario, mensagem],
        function (err) {
            if (err) {
                console.error('Erro ao salvar no banco:', err.message);
            } else {
                console.log(`Mensagem registrada no banco para ${contato}`);
            }
        }
    );
}

module.exports = {
    iniciarWhatsApp,
    enviarMensagem,
};
