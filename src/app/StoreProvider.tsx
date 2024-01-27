'use client'

import { getJwt } from '@/services/localStorage';
import { setUser } from '@/store/auth/auth.slice';
import { AppStore, makeStore } from '@/store/store';
import React, { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';

const StoreProvider = ({children}: {children: ReactNode}) => {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      {children}
    </Provider>
  )
}

export default StoreProvider;