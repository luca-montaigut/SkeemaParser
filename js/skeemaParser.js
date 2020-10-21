class SkeemaParser {
  constructor(schema, skipTimestamp = true) {
    this.schema = schema;
    this.skipTimestamp = skipTimestamp;
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

    const columnName = this.extractColumnName(line);
    const columnType = this.extractColumnType(line);

    if (columnType === "index") {
      this.addIndex(columnType, columnName);
    } else if (
      (columnName === "created_at" && this.skipTimestamp) ||
      (columnName === "updated_at" && this.skipTimestamp)
    ) {
      return;
    } else {
      this.addColumn(columnType, columnName);
    }
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
    return column.trim().split(" ")[1].split('"')[1];
  };
  extractColumnType = (column) => {
    return column.trim().split(" ")[0].split(".")[1];
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