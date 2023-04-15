import OfficialJokeService from "@/serverside/services/OfficialJokeService/OfficialJokeService";
import type { JokeEntity } from "@/serverside/domains/services/JokeDomainService.entities";

export default class JokeDomainService {
  static async GetJoke() {
    try {
      const joke = await OfficialJokeService.RandomJoke();

      const payload: JokeEntity = {
        setup: joke.setup,
        punchline: joke.punchline,
        language: "en",
      };

      return payload;
    } catch (error) {
      return { errorMessage: "Internal Server Error" };
    }
  }
}
