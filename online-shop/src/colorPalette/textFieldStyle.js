
const textFieldStyle = () => ({
    
    width:'100%', 
    backgroundColor:"white", 
    borderRadius:"5px",
        '& .MuiOutlinedInput-notchedOutline': {
            border: 2,
            color:"#69b05c",
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            border:2,
            color: '#69b05c'
        }
});

export default textFieldStyle