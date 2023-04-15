import GoogleTranslateService from "@/serverside/services/GoogleTranslateService/GoogleTranslateService";
import type { NextApiRequest, NextApiResponse } from "next";
import type { ErrorDTO } from "@/serverside/dtos/ErrorDTO";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ArrayBuffer | ErrorDTO>
) {
  try {
    const { text, language = "en-US" } = req.query;

    const response = await GoogleTranslateService.TextToVoice(
      String(text),
      String(language)
    );

    res.status(200).setHeader("content-type", "audio/mpeg").send(response.data);
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal Server Error" });
  }
}
