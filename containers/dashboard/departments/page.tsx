'use client';
import { Button } from '@/components/ui/button';
import React from 'react';

const ContainerDepartments = () => {
  const [data, setData] = React.useState([]);

  const getData = async () => {
    let page = 1;
    let hasMoreData = true;

    while (hasMoreData) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/extractInfo?url=https://www.informacolombia.com/directorio-empresas/departamento_cesar?qPg=${page}`
        );
        const result = await response.json();
        console.log(result.content);
        console.log(result);
        if (result && result.content) {
          console.log(result.content);
          //@ts-ignore
          setData((prevData) => [...prevData, ...result?.content]);
          page++;
        } else {
          hasMoreData = false;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        hasMoreData = false;
      }
    }
  };

  console.log(data);
  return (
    <section className='flex-1 w-full max-w-5xl p-4 mx-auto space-y-4 overflow-auto'>
      <section className='flex justify-between'>
        <section className='flex items-center'>
          <Button onClick={getData}>getData</Button>
        </section>
      </section>
    </section>
  );
};

export default ContainerDepartments;
