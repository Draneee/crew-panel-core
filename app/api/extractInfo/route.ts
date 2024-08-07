import { extract } from '@extractus/article-extractor';
import { type NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

export const GET = async (req: NextRequest) => {
  const queryParams = new URL(req.url).searchParams;
  const urlsQuery = queryParams.get('urls');
  if (!urlsQuery) {
    return NextResponse.json(meta);
  }

  const urls = urlsQuery.split(',').map((url) => url.trim());
  const contentArray = [];

  try {
    for (const url of urls) {
      const data = await extract(url);
      const content = parseHtmlToObj(data?.content);
      console.log('data =>', content);
      contentArray.push(...content); // Add all numbers to the main array
    }

    return NextResponse.json({
      content: contentArray,
    });
  } catch (err) {
    console.log('err =>', err);
    return NextResponse.json({
      error: 1,
      // message: err.message,
      data: null,
      meta,
    });
  }
};

const meta = {
  service: 'article-parser',
  lang: 'javascript',
  server: 'express',
  platform: 'node',
};

function parseHtmlToObj(htmlString?: string) {
  if (!htmlString) return [];
  console.log('htmlString', htmlString);
  const { document } = new JSDOM(htmlString).window;

  // Asegúrate de que el documento tiene una tabla
  const tableCheck = document.querySelector('table');

  let table = tableCheck ? tableCheck : document;

  const rows = table.querySelectorAll('tr');
  console.log('rows =>', rows);
  const data: any = [];

  console.log('rows =>', rows);

  rows.forEach((row, index) => {
    // Evita procesar la fila de encabezado
    if (index === 0) return;

    const cells = row.querySelectorAll('td');
    console.log('cells =>', cells);
    if (cells.length === 0) return; // Saltar filas vacías

    // Asumiendo que el teléfono está en la última celda
    const telefonoCell = cells[cells.length - 1]; // Asegúrate de que esta sea la celda correcta
    if (!telefonoCell) return;

    const telefonoText = telefonoCell.textContent;
    const telefono = telefonoText
      ? telefonoText.replace('Teléfono:', '').trim()
      : '';

    console.log('telefono', telefono);
    if (telefono[0] === '3') data.push(telefono);
  });

  return data;
}
