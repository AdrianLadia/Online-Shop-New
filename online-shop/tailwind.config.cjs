/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {},
  },
  important: true,
  plugins: [],
  theme: {
    extend: {
      height: {
        '1/10': "10%",
        '2/15': "12%",
        '9/10': "90%",
        '19/20': "95%",
      },
      keyframes: {
        'shake': {
          '0%, 100%': {
            transform: 'translateX(0)',
          },
          '10%, 30%, 50%, 70%, 90%': {
            transform: 'translateX(-10px)',
          },
          '20%, 40%, 60%, 80%': {
            transform: 'translateX(10px)',
          },
        },
        'bounce-fade': {
          '0%': { transform: 'translateY(0)', opacity: 1 },
          '50%': { transform: 'translateY(-70px)', opacity: 1 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        'bounce-fade-5': 'bounce-fade 1.25s ease-in-out 5',
        'shake': 'shake 1s ease-in-out infinite'
      },
      screens: {
        '3xs' : '281px',
        '2xs' : '366px',
        'xs' : '480px',
        '2md' : '800px',
        '2lg' : '1145px',
        '3xl' : '1751px'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      colors: {
        color60: '#69b05c', //logo green
        color30: '#bb9541', //logo brown
        color10a: '#6ab15d', // 
        color10b: '#6bd0ff', //light blue
        color10c: '#B6E388', //light green
        colorbackground: '#e1fadd', //bright green
        color1:"#d3eecf",
        color2:"#cceac7", //pale green
        blue1:"#429eff", //dark blue
        green1:"#AAC8A7",
        green2:"#C9DBB2",
        green3:"#96BB7C",
        green4:"#D6EFC7",
        green5:"#4E6C50"
      },
    },
  }
}
