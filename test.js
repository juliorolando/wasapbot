
                const puppeteer = require('puppeteer');

                async function getTuristaExchangeRate() {
                    try {
                        const browser = await puppeteer.launch({executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', args: ['--disable-http-cache'] });
                        const page = await browser.newPage();
                
                        await page.goto('http://dolar-turista.fiservargentina.com/');
                
                        // Espera explícitamente hasta que el elemento esté presente en la página
                        await page.waitForSelector('span[style="font-family: Arial, Helvetica, sans-serif;"] strong span', { timeout: 30000 });
                
                        // Obtiene el valor de la cotización del dólar turista
                        const turistaRate = await page.$eval('span[style="font-family: Arial, Helvetica, sans-serif;"] strong span', element => {
                            const textContent = element.textContent || '';
                            return parseFloat(textContent.replace('$', '').replace(',', ''));
                        });
                
                        await browser.close();
                
                        return turistaRate;
                    } catch (error) {
                        console.error('Error al obtener la cotización del dólar turista:', error.message);
                        return null;
                    }
                }
                
                getTuristaExchangeRate().then(rate => {
                    if (rate !== null) {
                        console.log('Cotización del dólar turista:', rate);
                    } else {
                        console.log('No se pudo obtener la cotización del dólar turista.');
                    }
                });
                