export default function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (e) {
      return false; // Malformed URL or invalid protocol
    }
  }