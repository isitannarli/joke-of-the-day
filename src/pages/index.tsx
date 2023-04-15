import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Typewriter } from "react-simple-typewriter";
import Layout from "@/clientside/components/Layout/Layout";
import JokeDomainService from "@/serverside/domains/services/JokeDomainService";
import changeFavicon from "@/clientside/utils/changeFavicon";
import type { JokeDTO } from "@/serverside/dtos/JokeDTO";

enum Steps {
  Idle,
  SetupStarted,
  SetupFinished,
  PunchlineStarted,
  PunchlineFinished,
  Final,
}

interface HomeProps {
  data: JokeDTO;
}

export default function Home(props: HomeProps) {
  const { data } = props;

  const [step, setStep] = useState<Steps>(Steps.Idle);

  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const finalVideoRef = useRef<HTMLVideoElement>(null);

  const typewriterOptions = {
    cursor: false,
    delaySpeed: 750,
    typeSpeed: 60,
  };

  const setupAudioUrl = `/api/text-to-voice?text=${data.setup}`;
  const punchlineAudioUrl = `/api/text-to-voice?text=${data.punchline}`;
  const sitcomLaughterApplauseAudioUrl = "/sitcom-laughter-applause-two.mp3";

  const onLoadedAudioData = () => {
    if (!audioPlayerRef.current) {
      return;
    }

    if (
      [
        Steps.SetupStarted,
        Steps.PunchlineStarted,
        Steps.PunchlineFinished,
      ].includes(step)
    ) {
      audioPlayerRef.current.play();
    }

    if (step === Steps.PunchlineFinished) {
      changeFavicon("/favicon-two.ico");
    }
  };

  const onEndedAudio = () => {
    if (!audioPlayerRef.current) {
      return;
    }

    if (
      [
        Steps.SetupStarted,
        Steps.PunchlineStarted,
        Steps.PunchlineFinished,
      ].includes(step)
    ) {
      setStep((prevStep) => prevStep + 1);
    }

    if (step === Steps.PunchlineStarted) {
      audioPlayerRef.current!.src = sitcomLaughterApplauseAudioUrl;
    }
  };

  useEffect(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.addEventListener("loadeddata", onLoadedAudioData);
      audioPlayerRef.current.addEventListener("ended", onEndedAudio);
    }

    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.removeEventListener(
          "loadeddata",
          onLoadedAudioData
        );
        audioPlayerRef.current.removeEventListener("ended", onEndedAudio);
      }
    };
  }, [step]);

  const getJoke = () => {
    setStep(Steps.SetupStarted);

    if (audioPlayerRef.current) {
      audioPlayerRef.current.src = setupAudioUrl;
    }
  };

  const getAnswer = () => {
    setStep(Steps.PunchlineStarted);

    if (audioPlayerRef.current) {
      audioPlayerRef.current.src = punchlineAudioUrl;
    }
  };

  return (
    <Layout className="flex flex-col items-center">
      {step === Steps.Idle && (
        <button
          onClick={getJoke}
          className="text-gray-500 cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110  duration-300 hover:text-black"
        >
          <Image
            src="/make-me-laugh.svg"
            alt="Make me laugh"
            width={297}
            height={136}
          />
        </button>
      )}
      {step >= Steps.SetupStarted && (
        <>
          <div className="text-3xl text-center">
            <Typewriter words={[data.setup]} {...typewriterOptions} />
          </div>
          {step === Steps.SetupFinished && (
            <button
              onClick={getAnswer}
              className="mt-10 hover:text-orange-500 cursor-pointer transition ease-in-out delay-150"
            >
              <Image
                src="/punchline.svg"
                alt="Punchline"
                width={100}
                height={138}
              />
            </button>
          )}
          {step >= Steps.PunchlineStarted && (
            <div className="mt-14 text-7xl text-center">
              <Typewriter words={[data.punchline]} {...typewriterOptions} />
            </div>
          )}
        </>
      )}
      <audio ref={audioPlayerRef}>
        <source src={audioPlayerRef.current?.src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      {step === Steps.Final && (
        <div className="fixed flex items-center justify-center top-0 left-0 w-full h-full bg-black">
          <video
            src="/final.mp4"
            className="w-full aspect-video"
            ref={finalVideoRef}
            autoPlay
            onEnded={() => {
              window.location.reload();
            }}
          >
            <source src="/final.mp4" type="video/mp4" />
            {`Your browser doesn't support HTML video`}
          </video>
        </div>
      )}
    </Layout>
  );
}

export async function getServerSideProps() {
  const data = await JokeDomainService.GetJoke();

  return { props: { data } };
}
