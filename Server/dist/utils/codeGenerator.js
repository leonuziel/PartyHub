import { customAlphabet } from 'nanoid';
// Generates a 4-character, uppercase, alphanumeric code (excluding easily confused chars)
const nanoid = customAlphabet('ABCDEFGHJKMNPQRSTUVWXYZ123456789', 4);
export const generateRoomCode = () => {
    return nanoid();
};
//# sourceMappingURL=codeGenerator.js.map