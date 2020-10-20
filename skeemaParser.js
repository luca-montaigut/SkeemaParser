class SkeemaParser {
  constructor(schema) {
    this.schema = schema;
    this.table = "";
    this.result = {};
  }

  parse = () => {
    const allLines = this.schema.split(/\r\n|\n/);
    if (!this.isSchemaDotRbFile(allLines)) {
      alert('Not a "schema.rb" file');
      return false;
    }

    allLines.forEach((line) => {
      this.processLine(line);
    });

    return this.result;
  };

  isSchemaDotRbFile = (allLines) => {
    let certification = false;
    allLines.forEach((line) => {
      if (line.trim().match(/ActiveRecord::Schema/)) {
        certification = true;
      }
    });
    return certification;
  };

  processLine = (line) => {
    this.table ? this.parseTableLine(line) : this.findNewTable(line);
  };

  parseTableLine = (line) => {
    if (line.trim().match(/^end$/)) {
      return this.endTable();
    }
    const column = this.extractColumnName(line);
  };

  findNewTable = (line) => {
    this.table = this.extractTableName(line);
    if (this.table) {
      this.startTable(this.table);
    }
  };

  extractTableName = (line) => {
    if (line.trim().match(/create_table (\S+)/)) {
      return line.split('"')[1];
    }
  };

  extractColumnName = (column) => {
    const type = column.trim().split(" ")[0].split(".")[1];
    const name = column.trim().split(" ")[1].split('"')[1];

    if (type === "index") {
      this.addIndex(type, name);
    } else {
      this.addColumn(type, name);
    }
  };

  startTable = (tableName) => {
    this.result[tableName] = {};
  };

  endTable = () => {
    this.table = "";
  };

  addColumn = (type, name) => {
    this.result[this.table][name] = type;
  };

  addIndex = (type, name) => {
    if (!this.result[this.table][type]) {
      this.result[this.table][type] = [];
    }
    this.result[this.table][type].push(name);
  };
}
// Parser for schema.rb file Rails 5+ (maybe before but untested)
// return {tableName: {columnName: columnType, ... , index: [columnName, ...]} ...}
// Based on : https://github.com/rubysolo/skeema
