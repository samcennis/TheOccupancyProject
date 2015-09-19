function generate8DigitID() {
    return (Math.random().toString(16) + "00000000").substr(2, 8);
}     

