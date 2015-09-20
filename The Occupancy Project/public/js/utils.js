function generate10DigitID() {
    
    function _p8(s){
        var p = (Math.random().toString(16) + "00000000").substr(2, 8);
        return s ? p.substr(0,2) : p ;
    }
    
    return _p8() + _p8(true); 
}     

