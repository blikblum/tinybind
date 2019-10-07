import { IFormatter } from '../../interfaces/formatter';
/**
 * equal or greater than
 * a >= b
 */
export const egtFormatter: IFormatter = {
  name: 'egt',
  read(a: number, b: number) {
    return a >= b;
  },
};
