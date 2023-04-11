/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
  theme: {
      extend: {
          colors: {
                'mines': {
                    DEFAULT: '#2D2D2D',
                    50: '#DADADA',
                    100: '#D0D0D0',
                    200: '#BCBCBC',
                    300: '#A7A7A7',
                    400: '#939393',
                    500: '#7F7F7F',
                    600: '#6A6A6A',
                    700: '#565656',
                    800: '#414141',
                    900: '#2D2D2D',
                    950: '#1F1F1F'
              },
              'twfg': {
                DEFAULT: '#83967D',
                50: '#F9FAF9',
                100: '#EFF1EE',
                200: '#D9DFD7',
                300: '#C3CDC1',
                400: '#AEBAAA',
                500: '#98A894',
                600: '#83967D',
                700: '#657660',
                800: '#485444',
                900: '#2B3329',
                950: '#1D221B'
              },
              'twfb': {
                DEFAULT: '#83967D',
                50: '#EAEEEC',
                100: '#E0E6E3',
                200: '#CCD6D0',
                300: '#B8C6BC',
                400: '#A4B6A6',
                500: '#92A691',
                600: '#83967D',
                700: '#697660',
                800: '#4D5444',
                900: '#303329',
                950: '#20221B'
              },
              
          },
      },
  },
  plugins: [],
}

