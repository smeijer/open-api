import { lineClamp } from '@twind/line-clamp';
import { blueGray, lightBlue, orange } from 'twind/colors';

export default {
  mode: 'silent',
  plugins: {
    'line-clamp': lineClamp,
  },
  theme: {
    extend: {
      colors: {
        gray: blueGray,
        blue: lightBlue,
        orange,
      },
    },
  },
};
