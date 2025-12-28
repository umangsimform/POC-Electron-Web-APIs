'use client';

import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import store from '.';
import { ReactNode } from 'react';

persistStore(store);

interface ReduxProviderProps {
  readonly children: ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
