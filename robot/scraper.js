const puppeteer = require('puppeteer');

async function iniciarNavegador() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized'],
    });

    const page = await browser.newPage();
    await page.goto('https://web.whatsapp.com');

    console.log('Aguardando login...');
    await page.waitForSelector('.x1y332i5.x1n2onr6.x6ikm8r.x10wlt62.xjwt4uw');
    console.log('Login realizado!');
    return page;
}

async function coletarMensagens(page) {
    const contatos = await page.$$eval('div[role="listitem"]', items =>
        items.map(item => {
            const contactElement = item.querySelector('._ak8q span[title]');
            return contactElement?.getAttribute('title');
        }).filter(Boolean)
    );

    const resultado = [];

    const limite = 10;
    const contatosLimitados = contatos.slice(0, limite);

    for (const contact of contatosLimitados) {
        const contatoSelector = `span[title="${contact}"]`;
        const contatoExiste = await page.$(contatoSelector);
        if (!contatoExiste) {
            console.warn(`Contato "${contact}" não encontrado, pulando...`);
            continue; // pula para o próximo contato
        }
        await page.click(contatoSelector);

        await new Promise(resolve => setTimeout(resolve, 5000));

        const mensagens = await page.evaluate(() => {
            const messageElements = document.querySelectorAll('div.message-in, div.message-out');
            return Array.from(messageElements).map(msg => {
                const text = msg.querySelector('span.selectable-text span')?.innerText || '';
                const time = msg.querySelector('span.x1rg5ohu.x16dsc37')?.innerText || '';
                const sender = msg.classList.contains('message-out') ? 'Você' : 'Contato';
                return { text, time, sender };
            });
        });

        resultado.push({ nome: contact, mensagens });
    }

    console.log(resultado)
    return resultado;
}

module.exports = { iniciarNavegador, coletarMensagens };
