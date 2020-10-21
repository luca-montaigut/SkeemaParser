const upload = document.querySelector("#upload");
const form = document.querySelector("form");
const input = document.querySelector("#file-input");
const skipTimestamp = document.querySelector("#skip-timestamp");
const result = document.querySelector("#result");

const displayResult = (result) => {};

const handleFile = (e) => {
  e.preventDefault();
  const file = input.files[0];
  if (!file) {
    return false;
  }

  result.style.display = "none";
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
    result.innerHTML = `<b>Hashed schema.rb</b><br/><p>${JSON.stringify(
      hash
    )}</p>`;
    result.style.display = "flex";
  };

  reader.onerror = (event) => {
    alert(event.target.error.name);
  };
};

form.addEventListener("submit", handleFile);

//  (\(\_
//  ( -.-)       "See you in the next hole!"
//  o_(")(")                          - LazyRabbit
