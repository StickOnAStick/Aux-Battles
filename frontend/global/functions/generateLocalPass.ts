export default function generateLocalPassword(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let password = '';
    for(let i = 0; i < 8; i++){
        const randIndex = Math.floor(Math.random() * chars.length);
        password += chars[randIndex];
    }
    return password;
}