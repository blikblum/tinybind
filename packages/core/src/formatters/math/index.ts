import { IModuleFormatters } from '../../interfaces';

// math formatters
import { random } from './random.formatter';
import { plus } from './plus.formatter';
import { minus } from './minus.formatter';
import { numberFormatter } from './number.formatter';
import { timesFormatter } from './times.formatter';
import { dividedBy } from './dividedBy.formatter';
import { modulo } from './modulo.formatter';
import { gcd } from './gcd.formatter';
import { even } from './even.formatter';
import { uneven } from './uneven.formatter';
import { digits } from './digits.formatter';

export { random, plus, minus, numberFormatter, timesFormatter, dividedBy, modulo, gcd, even, uneven, digits };

export const mathFormatters: IModuleFormatters = {
  digits, dividedBy, even, gcd, minus, number: numberFormatter, modulo, plus, random, times: timesFormatter, uneven,
};
