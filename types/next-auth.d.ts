declare module 'next-auth/react' {
  import { Session } from 'next-auth';
  
  export function useSession(): {
    data: Session | null;
    status: 'loading' | 'authenticated' | 'unauthenticated';
  };
} 