
    // The function successfully replaces all instances of "(plus)" with "+" in the query string.
function test_replaces_plus_in_query_string() {
  // Arrange
  const query = "(al)Uhai 600ml @400+1";
  const expected = "(al)Uhai 600ml @400+1";

  // Act
  const result = GetProductDetails(query);

  // Assert
  assert.equal(result, expected);
}

    // The function throws an error if the "settingsObj.settings.alradaitemnames" property is undefined.
function test_throws_error_if_settingsObj_settings_alradaitemnames_undefined() {
  // Arrange
  const query = "(al)Uhai 600ml @400+1";
  const appState = "";
  const exactdtail = "";

  // Act and Assert
  assert.throws(() => {
    GetProductDetails(query, appState, exactdtail);
  }, Error);
}

    // The function removes any trailing commas from the query string.
function test_removes_trailing_commas_from_query_string() {
  // Arrange
  const query = "(al)Uhai 600ml @400+1,";
  const expected = "(al)Uhai 600ml @400+1";

  // Act
  const result = GetProductDetails(query);

  // Assert
  assert.equal(result, expected);
}

    // The function removes all instances of "||" from the query string.
function test_removes_double_pipe_from_query_string() {
  // Arrange
  const query = "(al)Uhai 600ml @400+1||";
  const expected = "(al)Uhai 600ml @400+1";

  // Act
  const result = GetProductDetails(query);

  // Assert
  assert.equal(result, expected);
}

    // The function trims any leading or trailing commas from the query string.
function test_trims_leading_and_trailing_commas_from_query_string() {
  // Arrange
  const query = ",(al)Uhai 600ml @400+1,";
  const expected = "(al)Uhai 600ml @400+1";

  // Act
  const result = GetProductDetails(query);

  // Assert
  assert.equal(result, expected);
}

    // The function sets the default value of the "returntype" variable to "single" if it is not provided.
function test_sets_default_returntype() {
  // Arrange
  const query = "(al)Uhai 600ml @400+1";
  const expected = JSON.stringify({ json_response: [], finalTextResponseMsg: "", finalResponseMsg: "<li class=\"total\">TOTAL: 0 TZS </li>\n", finalResponseTotal: 0, finalQuery: "" });

  // Act
  const result = GetProductDetails(query);

  // Assert
  assert.equal(result, expected);
}

    // The function successfully parses the JSON string stored in "settingsObj.settings.alradaitemnames".
function test_parses_json_string() {
  // Arrange
  const query = "(al)Uhai 600ml @400+1";
  const expected = JSON.stringify({ json_response: [], finalTextResponseMsg: "", finalResponseMsg: "<li class=\"total\">TOTAL: 0 TZS </li>\n", finalResponseTotal: 0, finalQuery: "" });

  // Act
  const result = GetProductDetails(query);

  // Assert
  assert.equal(result, expected);
}

    // The function extracts the header row and body data from the parsed JSON.
function test_extracts_header_and_body_data() {
  // Arrange
  const query = "(al)Uhai 600ml @400+1";
  const expected = JSON.stringify({ json_response: [], finalTextResponseMsg: "", finalResponseMsg: "<li class=\"total\">TOTAL: 0 TZS </li>\n", finalResponseTotal: 0, finalQuery: "" });

  // Act
  const result = GetProductDetails(query);

  // Assert
  assert.equal(result, expected);
}

    // The function creates an array of data objects by combining the header row and body data.
function test_creates_array_of_data_objects() {
  // Arrange
  const query = "(al)Uhai 600ml @400+1";
  const appState = "";
  const exactdtail = "";

  // Act
  const result = GetProductDetails(query, appState, exactdtail);

  // Assert
  assert.isArray(result.json_response);
  assert.isNotEmpty(result.json_response);
}

    // The function converts the array of data objects into a JSON string.
function test_converts_array_to_json_string() {
  // Arrange
  const query = "(al)Uhai 600ml @400+1";
  const appState = "";
  const exactdtail = "";

  // Act
  const result = GetProductDetails(query, appState, exactdtail);

  // Assert
  assert.isString(result);
  assert.isTrue(result.startsWith("{"));
  assert.isTrue(result.endsWith("}"));
}

    // The function replaces line breaks and "TZS" with "<br>" in the JSON string.
function test_replaces_line_breaks_and_tzs() {
  // Arrange
  const query = "(al)Uhai 600ml @400+1";
  const appState = "";
  const exactdtail = "";

  // Act
  const result = GetProductDetails(query, appState, exactdtail);

  // Assert
  assert.isString(result);
  assert.notInclude(result, "\n");
  assert.include(result, "<br>");
  assert.notInclude(result, "TZS");
}

    // The function converts the query parameter to a string if it is not already a string.
function test_converts_query_to_string() {
  // Arrange
  const query = ["(al)Uhai 600ml @400+1", "(al)Uhai 500ml @300+1"];
  const expected = "(al)Uhai 600ml @400+1,(al)Uhai 500ml @300+1";

  // Act
  const result = GetProductDetails(query);

  // Assert
  assert.equal(result, expected);
}

    // The function splits the query string by commas and filters out any empty elements.
function test_splits_query_by_commas_and_filters_empty_elements() {
  // Arrange
  const query = "(al)Uhai 600ml @400+1,,(al)Uhai 500ml @300+1,";
  const expected = ["(al)Uhai 600ml @400+1", "(al)Uhai 500ml @300+1"];

  // Act
  const result = GetProductDetails(query);

  // Assert
  assert.deepEqual(result, expected);
}

    // The function calculates the number of items in the query string.
function test_calculates_number_of_items_in_query() {
  // Arrange
  const query = "(al)Uhai 600ml @400+1,(al)Uhai 500ml @300+1";
  const expected = 2;

  // Act
  const result = GetProductDetails(query);

  // Assert
  assert.equal(result, expected);
}

    // The function successfully replaces all instances of "(plus)" with "+" in the query string.
function test_replaces_plus_in_query_string() {
  // Arrange
  const query = "(al)Uhai 600ml @400+1";
  const expected = "(al)Uhai 600ml @400+1";

  // Act
  const result = GetProductDetails(query);

  // Assert
  assert.equal(result, expected);
}

    // The function handles cases where the query parameter is not a string.
function test_handles_non_string_query_parameter() {
  // Arrange
  const query = 123;
  const expected = "123";

  // Act
  const result = GetProductDetails(query);

  // Assert
  assert.equal(result, expected);
}

    // The function initializes variables for the response, item count, total price, projected profit total, remaining quantity, multiplier, raw product name, and projected profit.
function test_initializes_variables() {
  // Arrange
  const query = "(al)Uhai 600ml @400+1";
  const expected = JSON.stringify({
    json_response: [],
    finalTextResponseMsg: "",
    finalResponseMsg: "<li class=\"total\">TOTAL: 0 TZS </li>\n",
    finalResponseTotal: 0,
    finalQuery: ""
  });

  // Act
  const result = GetProductDetails(query);

  // Assert
  assert.equal(result, expected);
}
