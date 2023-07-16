export function createGuid() {
    const elements = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; 
    let array = new Array(20); 

    for(let i = 0; i < array.length; i++) {
        let randomNumber = Math.floor(Math.random() * elements.length);
        array[i] = elements.charAt(randomNumber); 
    }

    let guid = array.join(""); 

    return guid; 
}