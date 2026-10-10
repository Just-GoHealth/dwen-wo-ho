import { ROUTES } from "@/lib/constants/infra/routes";
import type {
  Landing2AchievementSlot,
  Landing2Character,
} from "@/lib/types/marketing/landing-2";

const LANDING_2_EMOJIS = {
  Hushed: "😮",
  Astonished: "😲",
  Screaming: "😱",
  Exploding: "🤯",
  Partying: "🥳",
};

/** Uniform stretch for landing-2 pacing (~+5–7s per full character cycle). */
export const LANDING_2_TIMING_SCALE = 1.5;

function scaleMs(ms: number): number {
  return Math.round(ms * LANDING_2_TIMING_SCALE);
}

export const LANDING_2_TIMING = {
  stageFade: scaleMs(700),
  bannerDelay: scaleMs(700),
  bannerInDuration: scaleMs(700),
  waveDropDelay: scaleMs(350),
  waveDropDuration: scaleMs(350),
  shakeDelay: scaleMs(200),
  shakeDuration: scaleMs(700),
  bannerHold: scaleMs(1400),
  bannerOutDuration: scaleMs(700),
  pauseAfterBanner: scaleMs(700),
  typeSpeed: scaleMs(45),
  holdBold: scaleMs(1400),
  deactivateDuration: scaleMs(700),
  pillDelay: scaleMs(700),
  meetShakeDelay: scaleMs(200),
  pillHold: scaleMs(1400),
  statLineHold: scaleMs(1400),
  clearTextDuration: scaleMs(700),
  relocateDuration: scaleMs(700),
  photoDelay: scaleMs(200),
  photoDuration: scaleMs(700),
  achStartDelay: scaleMs(350),
  achStagger: scaleMs(1400),
  blankHold: scaleMs(700),
  allLitHold: scaleMs(1400),
  lockInLabelMs: scaleMs(520),
  navDropStagger: scaleMs(150),
} as const;

export const LANDING_2_ACHIEVEMENT_SLOTS: Landing2AchievementSlot[] = [
  {
    id: 1,
    top: 320,
    emoji: LANDING_2_EMOJIS.Hushed,
    text: "Scored 1590 in SAT",
  },
  {
    id: 2,
    top: 430,
    emoji: LANDING_2_EMOJIS.Astonished,
    text: "Won Sharks Quiz",
  },
  {
    id: 3,
    top: 540,
    emoji: LANDING_2_EMOJIS.Screaming,
    text: "Won full scholarship to Uni.",
  },
  {
    id: 4,
    top: 650,
    emoji: LANDING_2_EMOJIS.Exploding,
    text: "Graduated with CGPA 4.0",
  },
  {
    id: 5,
    top: 760,
    emoji: LANDING_2_EMOJIS.Partying,
    text: "Never had B, all As in every exam",
  },
];

export const LANDING_2_CHARACTERS: Landing2Character[] = [
  {
    headline: "ace your SAT?",
    name: "Setornam",
    factPrefix: "He scored ",
    factHighlight: "1590",
    factSuffix: " in SAT(99th Percentile)",
    achievements: [
      { text: "Scored 1590 in SAT", emoji: LANDING_2_EMOJIS.Hushed },
      { text: "Won Sharks Quiz", emoji: LANDING_2_EMOJIS.Astonished },
      {
        text: "Won full scholarship to Uni.",
        emoji: LANDING_2_EMOJIS.Partying,
      },
      { text: "Graduated with CGPA 4.0", emoji: LANDING_2_EMOJIS.Partying },
      {
        text: "Never had B, all As in every exam",
        emoji: LANDING_2_EMOJIS.Partying,
      },
    ],
    photo: "/setornam.png",
    photoStyle: {
      left: "60px",
      top: "90px",
      width: "760px",
      height: "auto",
      transform: "rotate(-1deg)",
    },
  },
  {
    headline: "wanna win NSMQ?",
    name: "Newton",
    factPrefix: "He won both the ",
    factHighlight: "Regional and National NSMQ",
    factSuffix: ".",
    achievements: [
      {
        text: "Won the Presidential BECE Award",
        emoji: LANDING_2_EMOJIS.Hushed,
      },
      {
        text: "Won the Regional NSMQ (2019)",
        emoji: LANDING_2_EMOJIS.Astonished,
      },
      {
        text: "Won the National NSMQ (2019)",
        emoji: LANDING_2_EMOJIS.Screaming,
      },
      {
        text: "Graduated from KNUST Medical School",
        emoji: LANDING_2_EMOJIS.Exploding,
      },
    ],
    photo: "/newton-2.png",
    photoStyle: {
      left: "0px",
      top: "60px",
      width: "auto",
      height: "720px",
      transform: "scaleX(-1)",
      filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.5))",
    },
  },
];

export const LANDING_2_CONTENT = {
  metadata: {
    title: "Landing 2",
    description:
      "Meet Gen Z achievers and lock in your future with JustGo Health.",
  },
  navigation: {
    pledgeLabel: "The Pledge",
    providersLabel: "Providers",
  },
  intro: {
    bannerText: "Hello, Gen Z",
    lockInDefault: "Lock In Now",
  },
  assets: {
    wave: "/waving-hand-2.gif",
  },
  links: {
    home: ROUTES.public.landing,
    pledge: ROUTES.public.about,
    providers: ROUTES.public.joinAsProvider,
    landing: ROUTES.public.landing,
  },
} as const;
