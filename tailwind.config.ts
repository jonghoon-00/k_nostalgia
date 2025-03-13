import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem'
    },
    extend: {
      colors: {
        //색 설정
        //background
        normal: '#FAF8F5',

        //label 색상
        'label-strong': '#151515',
        'label-normal': '#3A3835',
        'label-alternative': '#79746D',
        'label-assistive': '#A49F99',
        'label-disable': '#DDDAD7',
        'label-light': '#F6F5F3',

        //primary 색상
        'primary-heavy': '#755428',
        'primary-strong': '#A87939',
        'primary-normal': '#DB9D4A',
        'primary-lightness': '#F5C584',

        'primary-10': '#755428',
        'primary-20': '#9C6D2E',
        'primary-30': '#BD873F',
        'primary-40': '#D6A461',
        'primary-50': '#E8C18E',
        'primary-60': '#F3D9B6',
        'primary-70': '#F6E5CE',
        'primary-80': '#FFF3E3',
        'primary-90': '#FFF8EF',

        //secondary 색상
        'secondary-heavy': '#586452',
        'secondary-strong': '#86957E',
        'secondary-normal': '#A6BB9C',
        'secondary-lightness': '#DAE9D3',

        'secondary-10': '#586452',
        'secondary-20': '#74826D',
        'secondary-30': '#93A888',
        'secondary-40': '#B7CBAE',
        'secondary-50': '#C9DBC0',
        'secondary-60': '#DBEAD4',
        'secondary-70': '#E9F4E3',
        'secondary-80': '#EFF9EB',
        'secondary-90': '#F6FFF2',

        //status 색상
        'status-negative': '#ED1B18',
        'status-positive': '#2A62F4',

        'product-custom': 'rgba(0, 0, 0, 0.20)',

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 2px)',
        md: 'calc(var(--radius) - 4px)',
        lg: 'calc(var(--radius) - 8px)',
        // lg: 'var(--radius)',
        // md: 'calc(var(--radius) - 2px)',
        // sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      screens: {
        xs: { min: '376px' }
      },
      boxShadow: {
        custom: '0px -2px 8px 0px rgba(31, 30, 30, 0.08)',
        chatCustom : '0px 1px 2px 0px rgba(0, 0, 0, 0.24), 0px 0px 1px 0px rgba(0, 0, 0, 0.08), 0px 0px 1px 0px rgba(0, 0, 0, 0.08)'
      },
      fontFamily: {
        pretendard: ['var(--font-pretendard)'],
        custom: ['YeojuCeramic']
      }
    }
  },
  plugins: [require('tailwindcss-animate'), require('tailwind-scrollbar-hide')]
} satisfies Config;

export default config;
