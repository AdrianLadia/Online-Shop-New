class jsonUtils {
  static parseJson(json) {
    try {
      return JSON.parse(json);
    } catch (e) {
      return e;
    }
  }

  static stringifyJson(json) {
    try {
      return JSON.stringify(json);
    } catch (e) {
      return e;
    }
  }
}

export default jsonUtils;
