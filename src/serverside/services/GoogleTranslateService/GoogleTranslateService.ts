import axios from "axios";

export default class GoogleTranslateService {
  static async TextToVoice(text: string, language: string = "en-US") {
    return axios.get<ArrayBuffer>(
      "https://translate.google.com/translate_tts",
      {
        params: {
          ie: "UTF-8",
          q: text,
          tl: language,
          client: "tw-ob",
        },
        responseType: "arraybuffer",
      }
    );
  }
}
