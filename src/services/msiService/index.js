
import cfb from './cfb';
import _ from 'lodash';
import helpers from './helpers';
import StringContainer from './stringContainer';
import MsiTable from './table';

const streamNames = {
  stringPool: '\u4840_StringPool',
  stringData: '\u4840_StringData',
};

const knownTables = {
  property: {
    name: '\u4840Property',
    columns: [{
      name: 'Property',
      flags: helpers.columnTypes.MSITYPE_STRING | helpers.columnTypes.MSITYPE_KEY
    }, {
      name: 'Value',
      flags: helpers.columnTypes.MSITYPE_STRING
    }]
  },
};

export default class MsiDatabase {
  constructor(buffer) {
    this.compoundFile = cfb.parse(buffer, { maxSectorLength: 10000 });

    const stringPool = this.compoundFile.FileIndex.find(x => x.type == 2 && helpers.decodeName(x.name).rawValue == streamNames.stringPool);
    const stringData = this.compoundFile.FileIndex.find(x => x.type == 2 && helpers.decodeName(x.name).rawValue == streamNames.stringData);

    this.stringContainer = new StringContainer(stringPool.content, stringData.content);

    const propertyTable = new MsiTable(this, knownTables.property.name, knownTables.property.columns);
    this.properties = _.fromPairs(propertyTable.rows);
  }
  getColumnWidth(column) {
    if (helpers.hasFlag(column.flags, helpers.columnTypes.MSITYPE_STRING)) {
      return this.stringContainer.fieldLength;
    } else if (helpers.hasFlag(column.flags, helpers.columnTypes.MSITYPE_SHORT) || helpers.hasFlag(column.flags, helpers.columnTypes.MSITYPE_BINARY)) {
      return 2;
    } else {
      return 4;
    }
  }
}