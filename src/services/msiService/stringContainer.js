import { decode } from "iconv-lite";
import helpers from './helpers';

export default class StringContainer {
  constructor(stringPool, stringData) {
    this.stringData = stringData;
    this.stringPool = stringPool;
    this.strings = [{
      pos: 0,
      length: 0,
      referenceCount: 0,
      unicode: false,
    }];

    if (stringPool.length < 4) {
      this.encoding = 'win1251';
      this.codePage = 0;
      this.fieldLength = 2;
    }
    else {
      this.codePage = helpers.readInt16(stringPool, 0);

      switch (this.codePage) {
        case 1252:
          this.encoding = 'win1252';
          break;

        default:
          this.encoding = 'win1251';
          break;
      }

      if (stringPool[2] == 0 && stringPool[3] == 0x80) {
        this.fieldLength = 3;
      }
      else {
        this.fieldLength = 2;
      }
    }

    let stringLength, pos = 0, referenceCount = 0;

    for (let i = 4; i < stringPool.length - 3; i += 4) {
      stringLength = helpers.readInt16(stringPool, i);
      referenceCount = helpers.readInt16(stringPool, i + 2);

      let unicode = false;
      if (helpers.hasFlag(referenceCount, helpers.stringUnicodeFlag)) {
        // string contains unicode - doesn't matter to us though, we decode it just the same
        unicode = true;
        referenceCount &= ~helpers.stringUnicodeFlag;
      }

      if (stringLength == 0) {
        if (!referenceCount == 0) {
          // if length is zero, the entry takes up two rows and represents a string that is
          // 2^16 bytes or longer
          stringLength = helpers.readInt32(stringPool, i + 4);

          if (stringLength > 0) {
            // if length is positive, it means that this is an long string as described above
            // so we should skip ahead by 4 bytes to the next entry
            i += 4;
          }
          else {
            // otherwise the string is a null entry and we shouldn't skip ahead.
          }
        }
      }

      this.strings.push({
        pos,
        length: stringLength,
        referenceCount,
        unicode,
      });

      pos += stringLength;
    }
  }
  readString(index) {
    const string = this.strings[index];

    if (string.length == 0) {
      return null;
    } else {
      return decode(this.stringData.slice(string.pos, string.pos + string.length), this.encoding);
    }
  }
  readStringFromBuffer(buffer, pos) {
    let stringId = helpers.readInt16(buffer, pos);

    if (this.fieldLength === 3) {
      stringId += buffer[pos + 2] << 16;
    }

    return this.readString(stringId);
  }
}