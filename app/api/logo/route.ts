import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET() {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://sucursalpersonas.transaccionesbancolombia.com/');

    // Esperar a que los campos de entrada estén disponibles
    await page.waitForSelector('#username');

    // Reemplaza con las credenciales del usuario
    const username = 'edgardorcm21';

    // Completar el formulario de login
    await page.type('#username', username);
    // Hacer clic en el botón de login
    await page.click('#btnGo');

    // Esperar a que la navegación se complete
    await page.waitForNavigation();

    // Esperar a que la imagen con id 'rsaImage' esté disponible
    await page.waitForSelector('#rsaImage');

    // Obtener el src de la imagen
    const imageSrc = await page.evaluate(() => {
      const img = document.querySelector('#rsaImage') as any;

      return img ? img.src : null;
    });

    await browser.close();

    return NextResponse.json({ imageSrc });
  } catch (error: any) {
    console.log('error =>', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
