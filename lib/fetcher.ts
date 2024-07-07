import { API_URL_SUPABASE, TOKEN_SUPABASE } from './const';
interface RequestModify extends RequestInit {
  extractTotal?: boolean;
}
export const fetcherSupabase = (
  ...args: [string, RequestModify?, boolean?]
) => {
  const [url, options = {}] = args;
  const { extractTotal, ...restOptions } = options;
  const enhancedOptions: any = {
    ...restOptions,
    headers: {
      apiKey: TOKEN_SUPABASE,
      Authorization: 'Bearer ' + TOKEN_SUPABASE,
      ...restOptions.headers,
    },
  };

  return fetch(API_URL_SUPABASE + url, enhancedOptions).then(async (res) =>
    extractTotal ? extractTotalFunc(res) : res.json()
  );
};

const extractTotalFunc = async (res: Response) => {
  const contentRange = res.headers.get('Content-Range');
  console.log('Content-Range:', contentRange);

  const match = contentRange?.match(/\/(\d+)/);
  const totalItems = match ? parseInt(match[1], 10) : null;
  console.log('Total Items:', totalItems);

  const data = await res.json();
  return {
    data,
    totalItems,
  };
};
