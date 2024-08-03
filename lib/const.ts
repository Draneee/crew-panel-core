export const API_URL_CHECK_NUMBER = process.env.NEXT_PUBLIC_API_NUMBERS;
export const API_URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const TOKEN_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export enum CATALOG_STEPS {
  LOADING, // waiting validation
  PAYMENT_INFORMATION, // payment information
  BANK_LOGO, // bank logo
  OTP, // code otp
  TK, // token or dinamyc key
  FINAL, // finish
}

export enum CATALOG_BC {
  END,
  OTP,
  USER,
  LOGIN,
  LOADING,
  DYNAMIC,
  PASSWORD,
  TC,
}

const enumToArray = (enumObj: any) => {
  return Object.keys(enumObj)
    .filter((key) => isNaN(Number(key)))
    .map((key) => {
      console.log(key);
      return {
        value: enumObj[key],
        label: key,
      };
    });
};

export const ARRAY_CATALOG_STEPS = enumToArray(CATALOG_STEPS);
