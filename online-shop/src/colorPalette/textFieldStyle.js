
const textFieldStyle = () => ({
    
    width:'100%', 
    backgroundColor:"white", 
    borderRadius:"5px",
        '& .MuiOutlinedInput-notchedOutline': {
            border: 2,
            color:"#6bd0ff",
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            border:2,
            color: '#429eff'
        }
});

export default textFieldStyle