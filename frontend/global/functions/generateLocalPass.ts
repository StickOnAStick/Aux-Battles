export default function generateLocalPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let password = '';
    for(let i = 0; i < 8; i++){
        const randIndex = Math.floor(Math.random() * chars.length);
        if( i % 4 === 0 && i != 0 ) password += "-";
        password += chars[randIndex];
    }
    return password;
}