function main(baseUrl) {
  return function (path) {
    return function (params) {
      return baseUrl + path + params;
    };
  };
}
const base = main("https://IfyouKnow");
const baseandPath = base("/you");
const result = baseandPath("?know:true");
