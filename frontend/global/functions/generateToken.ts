export function generateToken(length: number): string {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var token: string = '';
    for(var i = 0; i < length; i++){
        token += chars[Math.floor(Math.random() * chars.length)];
        if(i !== 0 && i % 5 == 0) token += '-';
    }
    return token;
}