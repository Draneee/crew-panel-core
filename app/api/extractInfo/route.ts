import { extract } from '@extractus/article-extractor';
import { type NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

export const GET = async (req: NextRequest) => {
  const queryParams = new URL(req.url).searchParams;
  const urlQuery = queryParams.get('url');
  if (!urlQuery) {
    return NextResponse.json(meta);
  }
  try {
    const data = await extract(urlQuery);

    const content = parseHtmlToObj(data?.content);

    return NextResponse.json({
      urlQuery,
      content,
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
  if (!htmlString) return {};
  const { document } = new JSDOM(htmlString).window;
  const rows = document.querySelectorAll('table tr');
  const data: any = [];

  rows.forEach((row: any, index: any) => {
    if (index === 0) return; // Saltar la fila del encabezado
    const cells = row.querySelectorAll('td');
    if (cells.length === 0) return; // Saltar filas vacías

    const empresa = cells[0].querySelector('a').textContent.trim();
    const localidad = cells[1].textContent.replace('Localización:', '').trim();
    const departamento = cells[2].textContent.trim();
    const telefono = cells[3].textContent.replace('Teléfono:', '').trim();

    if (telefono[0] === '3')
      data.push({
        empresa,
        localidad,
        departamento,
        telefono,
      });
  });

  return data;
}
