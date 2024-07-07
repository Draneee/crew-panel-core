import { WebEngageV1InfoAirports } from '@/containers/dashboard/components/card-render';
import React from 'react';
type infoType = {
  data: WebEngageV1InfoAirports[];
  totalItems: number;
};
interface IInfoGlobally {
  info: infoType | undefined;
  setInfo: React.Dispatch<React.SetStateAction<infoType | undefined>>;
}
const InfoGlobally = React.createContext<IInfoGlobally | null>(null);
export const useInfoGlobally = () => React.useContext(InfoGlobally);

export function InfoGloballyProvider(props: { children: React.ReactNode }) {
  const [info, setInfo] = React.useState<infoType | undefined>();

  return (
    <InfoGlobally.Provider
      value={{
        info,
        setInfo,
      }}
    >
      {props.children}
    </InfoGlobally.Provider>
  );
}
