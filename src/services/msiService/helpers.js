import { encode } from "iconv-lite";

export default {
  charSet: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '.', '_'],
  singleCharOffset: 0x4800,
  doubleCharOffset: 0x3800,
  doubleCharMask: 0x40,
  tableIdentifier: '\u4840',
  stringUnicodeFlag: 0x8000,
  columnTypes: {
    ColumnWidthMask: 0xFF,

    MSITYPE_LONG: 0x0,
    MSITYPE_16BIT_INTEGER: 0x2,
    MSITYPE_32BIT_INTEGER: 0x4,
    MSITYPE_PERSISTENT: 0x100,
    MSITYPE_LOCALIZABLE: 0x200,
    MSITYPE_SHORT: 0x400,
    MSITYPE_BINARY: 0x800,
    MSITYPE_STRING: 0xC00,
    MSITYPE_NULLABLE: 0x1000,
    MSITYPE_KEY: 0x2000,
    MSITYPE_TEMPORARY: 0x4000
  },

  decodeName(input) {
    const charBuffer = encode(input, 'utf16', { addBOM: false });

    let output = '', currentChar, doubleEncodedValue;

    for (let i = 0; i < charBuffer.length; i += 2) {
      currentChar = this.readInt16(charBuffer, i);

      if (currentChar >= this.doubleCharOffset && currentChar < this.singleCharOffset) {
        // if the value is between 0x3800 and 0x47ff then
        // the value represents two characters
        doubleEncodedValue = currentChar - this.doubleCharOffset;

        const double1 = doubleEncodedValue & (this.doubleCharMask - 1);
        const double2 = Math.floor(doubleEncodedValue / this.doubleCharMask);

        output += this.charSet[double1];
        output += this.charSet[double2];
      }
      else if (currentChar >= this.singleCharOffset && currentChar < this.singleCharOffset + this.charSet.length) {
        // if the value is between 0x4800 and 0x483f then 
        // the value represent a single character
        output += this.charSet[currentChar - this.singleCharOffset];
      }
      else {
        // otherwise the value should be added as a normal unicode character.
        output += input[i / 2];
      }
    }

    const isTable = output[0] == this.tableIdentifier;

    return {
      isTable,
      value: isTable ? output.substring(1) : output,
      rawValue: output
    };
  },
  isInCharSet(char) {
    return this.charSet.includes(char);
  },
  readInt16(buffer, pos) {
    return (buffer[pos + 1] << 8) + buffer[pos];
  },
  readInt32(buffer, pos) {
    return (buffer[pos + 3] << 24) + (buffer[pos + 2] << 16) + (buffer[pos + 1] << 8) + buffer[pos];
  },
  hasFlag(value, flag) {
    return (value & flag) == flag;
  }
};