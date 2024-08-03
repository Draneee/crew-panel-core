import MenuLinks from './menu-links';
import MarketSelector from './market-selector';

export default function Sidebar() {
  return (
    <aside className='relative z-10 flex flex-col justify-between h-full pb-12 bg-black border-e'>
      <section className='space-y-4'>
        <div className='grid h-12 border-b place-items-center'>
          <img
            className='h-8 '
            src='https://res.cloudinary.com/dnpu9jffh/image/upload/v1722537513/Group_11_oapusr.svg'
            alt='Logo Adrian'
          />
        </div>
        <section className='px-4 space-y-6'>
          <MenuLinks />
        </section>
      </section>
    </aside>
  );
}
