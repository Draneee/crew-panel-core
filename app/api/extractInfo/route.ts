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
  const { document } = new JSDOM(htmlString).window;
  const rows = document.querySelectorAll('table tr');
  const data: any = [];

  rows.forEach((row: any, index: any) => {
    if (index === 0) return; // Saltar la fila del encabezado
    const cells = row.querySelectorAll('td');
    if (cells.length === 0) return; // Saltar filas vacías

    const telefono = cells[3].textContent.replace('Teléfono:', '').trim();

    if (telefono[0] === '3') data.push(telefono);
  });

  return data;
}
