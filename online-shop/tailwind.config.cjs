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
      keyframes: {
        'bounce-fade': {
          '0%': { transform: 'translateY(0)', opacity: 1 },
          '50%': { transform: 'translateY(-20px)', opacity: 1 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        'bounce-fade-5': 'bounce-fade 1.25s ease-in-out 5',
      },
      colors: {

        //f // COLOR 1
        color60: '#69b05c', // ABC270
        color30: '#bb9541', // F49C5C
        color10a: '#FEC868', // FEC868
        color10b: '#6bd0ff', // 473C33
        color10c: '#B6E388',
        colorbackground: '#e1fadd',
        color1:"#beddb8",
        color2:"#cceac7"

        // beddb8
        // ecd7a8

        //f COLOR 1
        // color60: '#94B49F', // 94B49F
        // color30: '#CEE5D0', // CEE5D0
        // color10a: '#F4B183', // F4B183
        // color10b: '#C3958A', // C3958A

        //f COLOR 2
        // color60: '#809A6F', // 809A6F
        // color30: '#CC9C75', // CC9C75
        // color10a: '#D5D8B5', // D5D8B5
        // color10b: '#A25B5B', // A25B5B

        // //f // COLOR 3
        // color60: '#ABC270', // ABC270
        // color30: '#F49C5C', // F49C5C
        // color10a: '#FEC868', // FEC868
        // color10b: '#473C33', // 473C33

        // f// COLOR 4
        // color60: '#CC9C75', // CC9C75
        // color30: '#D5D8B5', // D5D8B5
        // color10a: '#809A6F', //809A6F
        // color10b: '#A25B5B', // A25B5B

        // // COLOR 5
        // color60: '#C7E9B0', // C7E9B0
        // color30: '#D9A152', // "D9A152
        // color10a: '#FFD786', // FFD786
        // color10b: '#9F6D1F', // 9F6D1F

        // // COLOR 6
        // color60: '#C8DE7F', // C8DE7F
        // color30: '#9CDE8D', // 9CDE8D
        // color10a: '#FFD786', // FFD786
        // color10b: '#F4B183', // F4B183

        // // COLOR 7
        // color60: '#AB7462', // AB7462
        // color30: '#2FC193', // 2FC193
        // color10a: '#FFC0B6', // FFC0B6
        // color10b: '#FF8981', // FF8981

        // f// COLOR 8
        // color60: '#9FC088', // 9FC088
        // color30: '#E8C07D', // E8C07D
        // color10a: '#FF7B54', // FF7B54
        // color10b: '#CE5959', // CE5959

        // // COLOR 9
        // color60: '#FFD495', // FFD495
        // color30: '#D7E9B9', // D7E9B9
        // color10a: '#FAAB78', // FAAB78
        // color10b: '#FFB84C', // FDD36A
        
        // // COLOR 10
        // color60: '#76BA99', // 76BA99
        // color30: '#CED89E', // CED89E
        // color10a: '#ADCF9F', // ADCF9F
        // color10b: '#F16767', // FFC77E
      },
    },
  }
}
