import axios from "axios";
import NodeCache from "node-cache";
import type { JokeResponse } from "@/serverside/services/OfficialJokeService/OfficialJokeService.types";

export default class OfficialJokeService {
  private static cache: NodeCache = new NodeCache({
    stdTTL: 60 * 60,
    checkperiod: 60 * 60,
  });

  private static getJokes() {
    return axios.get<JokeResponse>(
      "https://raw.githubusercontent.com/15Dkatz/official_joke_api/master/jokes/index.json"
    );
  }

  private static async getJokesWithCache() {
    const cachedData = OfficialJokeService.cache.get("jokes");

    if (cachedData) {
      return JSON.parse(<string>cachedData) as JokeResponse;
    }

    const { data } = await OfficialJokeService.getJokes();
    OfficialJokeService.cache.set("jokes", JSON.stringify(data));

    return data;
  }

  private static getRandomObject<T = any>(arr: T[]): T {
    const randomIndex = Math.floor(Math.random() * arr.length);

    return arr[randomIndex || 0];
  }

  static async RandomJoke() {
    const jokes = await OfficialJokeService.getJokesWithCache();

    return OfficialJokeService.getRandomObject(jokes);
  }
}
