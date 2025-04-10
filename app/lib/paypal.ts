import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const initialOptions = {
  clientId: process.env.PAYPAL_CLIENT_ID!,
  currency: 'USD',
  intent: 'capture',
};

export const PayPalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
}; 