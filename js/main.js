const upload = document.querySelector("#upload");
const form = document.querySelector("form");
const input = document.querySelector("#file-input");
const skipTimestamp = document.querySelector("#skip-timestamp");
const result = document.querySelector("#result");

const splitToJSONify = (hash) => {
  return JSON.stringify(hash)
    .split(/(,)|({)|(},)|(})|(\[)|(],)|(])/)
    .filter((el) => el !== undefined && el !== "");
};

const displayResult = (hash) => {
  result.innerHTML = `<b>schema.json</b><br/><div id="area"></div>`;
  const area = document.querySelector("#area");
  const space = "  ";
  let spacer = 0;

  splitToJSONify(hash).forEach((line) => {
    if (line === "{") {
      area.insertAdjacentHTML(
        "beforeend",
        `<pre>${space.repeat(spacer) + line}</pre>`
      );
      spacer++;
    } else if (line === "}" || line === "}," || line === "]" || line === "],") {
      spacer--;
      area.insertAdjacentHTML(
        "beforeend",
        `<pre>${space.repeat(spacer) + line}</pre>`
      );
    } else if (line === ",") {
      area.lastElementChild.innerText += line;
    } else if (line === "[") {
      area.lastElementChild.innerText += ` ${line}`;
      spacer++;
    } else {
      area.insertAdjacentHTML(
        "beforeend",
        `<pre>${space.repeat(spacer) + line}</pre>`
      );
    }
  });
};

//<p>${JSON.stringify(hash)}</p>

const handleFile = (e) => {
  e.preventDefault();
  const file = input.files[0];
  if (!file) {
    return false;
  }

  result.innerHTML = "";

  if (file.name !== "schema.rb") {
    if (!confirm('Are you sure that your file is a "schema.rb" ?')) {
      return false;
    }
  }

  const reader = new FileReader();

  reader.readAsText(file);

  reader.onload = (event) => {
    const schema = event.target.result;
    const skip = skipTimestamp.value === "true";
    console.log(skip);
    hash = new SkeemaParser(schema, skip).parse();
    if (!hash) {
      throw Error("Not a schema.rb file");
    }
    console.log(hash);
    displayResult(hash);
  };

  reader.onerror = (event) => {
    alert(event.target.error.name);
  };
};

form.addEventListener("submit", handleFile);

//  (\(\_
//  ( -.-)       "See you in the next hole!"
//  o_(")(")                          - LazyRabbit
