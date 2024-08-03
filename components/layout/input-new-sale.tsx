import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const InputNewSale = ({
  nameId = 'Lorem',
  label = 'Lorem',
  className = '',
  type = 'string',
}) => {
  return (
    <div
      className={cn('grid w-full items-center col-span-6 gap-1.5', className)}
    >
      <Label htmlFor={nameId}>{label}</Label>
      <Input type={type} id={nameId} />
    </div>
  );
};

export default InputNewSale;
