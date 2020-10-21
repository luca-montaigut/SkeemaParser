# SkeemaParser
A parser for schema.rb file Rails 5+ (maybe before but untested)

# How tu use

You can put a `schema.rb` file in the input file form on https://luca-montaigut.github.io/SkeemaParser/
and receive a hash of your schema.rb like this :

```{tableName: {columnName: columnType, ... , index: [columnName, ...]} ...}```

(presence in browser console too)

If you want to use the parser in your own programme, get the file `skeema.js` and use the class like this :
```
const yourVariable = new Skeema(yourSchemaRbFile).parse();
```
_NB : "yourSchemaRbFile" has to be a string (more on this [here](https://developer.mozilla.org/fr/docs/Web/API/FileReader/readAsText))_


## Purpose
Made to be used in a project of create automated seeds.rb file template based on schema.rb file.

## 🐰 Author
Luca Montaigut : https://github.com/luca-montaigut

Based on : https://github.com/rubysolo/skeema
