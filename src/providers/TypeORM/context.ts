import * as React from 'react';
import { DataSource } from 'typeorm';

export interface ITypeORMContext {
  AppDataSource?: DataSource;
}

export const TypeORMContext = React.createContext<ITypeORMContext>({});

export const useTypeORM = () => React.useContext(TypeORMContext);
