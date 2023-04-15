export interface Joke {
  type: string;
  setup: string;
  punchline: string;
}

export type JokeResponse = Joke[];
