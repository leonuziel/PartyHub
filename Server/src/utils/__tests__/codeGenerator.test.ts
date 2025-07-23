import { generateRoomCode } from '../codeGenerator.js';

describe('generateRoomCode', () => {
  it('should generate a string of length 4', () => {
    const code = generateRoomCode();
    expect(typeof code).toBe('string');
    expect(code.length).toBe(4);
  });

  it('should generate a code containing only uppercase letters and numbers', () => {
    const code = generateRoomCode();
    const regex = /^[A-Z0-9]+$/;
    expect(regex.test(code)).toBe(true);
  });

  it('should not generate easily confused characters', () => {
    const code = generateRoomCode();
    const confusedChars = ['I', 'L', 'O', '0'];
    confusedChars.forEach(char => {
        expect(code.includes(char)).toBe(false);
    });
  });

  it('should generate different codes on subsequent calls', () => {
    const code1 = generateRoomCode();
    const code2 = generateRoomCode();
    expect(code1).not.toBe(code2);
  });
});
