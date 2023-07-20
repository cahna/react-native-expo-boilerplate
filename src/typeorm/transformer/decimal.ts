/* eslint-disable class-methods-use-this */
import Decimal from 'decimal.js';
import { ValueTransformer } from 'typeorm';

export const DecimalToString = (decimals: number) => (decimal?: Decimal) =>
  decimal?.toFixed?.(decimals) || decimal;

export class DecimalTransformer implements ValueTransformer {
  /**
   * Used to marshal Decimal when writing to the database.
   */
  to(decimal?: Decimal): string | null {
    return decimal?.toString() ?? null;
  }

  /**
   * Used to unmarshal Decimal when reading from the database.
   */
  from(decimal?: string): Decimal | null {
    return decimal ? new Decimal(decimal) : null;
  }
}
