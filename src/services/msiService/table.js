import helpers from './helpers';

export default class MsiTable {
  constructor(database, name, columns) {
    this.database = database;
    this.name = name;
    this.rows = [];

    this.columns = columns.map(col => ({
      ...col,
      width: database.getColumnWidth(col)
    }));

    this.data = database.compoundFile.FileIndex.find(x => x.type == 2 && helpers.decodeName(x.name).rawValue == name).content;
    this.rowCount = this.data.length / this.columns.reduce((x, y) => x + y.width, 0);

    this.loadRows();
  }
  loadRows() {
    for (let rowId = 0; rowId < this.rowCount; rowId++) {
      let row = [];
      let dataPos = 0;

      this.columns.forEach((column, columnIndex) => {
        // move to the position where the current row data starts
        dataPos += rowId * column.width;

        if (helpers.hasFlag(column.flags, helpers.columnTypes.MSITYPE_STRING)) {
          // string
          row.push(this.database.stringContainer.readStringFromBuffer(this.data, dataPos));
        }
        else if (helpers.hasFlag(column.flags, helpers.columnTypes.MSITYPE_SHORT)) {
          // short
          row.push(this.readEncodedShort(this.data, dataPos));
        }
        else if (!helpers.hasFlag(column.flags, helpers.columnTypes.MSITYPE_BINARY)) {
          row.push(this.readEncodedInt(this.data, dataPos));
        }

        if (columnIndex < this.columns.length - 1) {
          // move to the start of the next column
          dataPos += (this.rowCount - rowId) * column.width;
        }
      });

      this.rows.push(row);
    }
  }
  readEncodedShort(buffer, pos) {
    let encoded = helpers.readInt16(buffer, pos);

    if (encoded === 0) {
      return null;
    }
    else {
      encoded += 32768;

      return encoded > 32767 ? encoded - 65535 : encoded;
    }
  }
  readEncodedInt(buffer, pos) {
    let encoded = helpers.readInt32(buffer, pos);

    if (encoded === 0) {
      return null;
    }
    else {
      encoded += 2147483647;

      return encoded > 2147483647 ? encoded - 4294967295 : encoded;
    }
  }
}