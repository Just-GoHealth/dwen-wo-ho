export type JoinAsProvider2PillIconKey = "heart" | "zap" | "handshake";

export type JoinAsProvider2FooterIconKey =
  "lock" | "graduation-cap" | "message-circle";

export type JoinAsProvider2BubbleMarkupKey = "bubble1" | "bubble2" | "bubble3";

export interface JoinAsProvider2ShowcaseCard {
  pillTitle: string;
  pillIcon: JoinAsProvider2PillIconKey;
  footerIcon: JoinAsProvider2FooterIconKey;
  footerText: string;
  markupKey: JoinAsProvider2BubbleMarkupKey;
  revealDelayMs: number;
}

export interface JoinAsProvider2ShowcaseCardProps {
  cardIndex: number;
  pillTitle: string;
  pillIcon: JoinAsProvider2PillIconKey;
  footerIcon: JoinAsProvider2FooterIconKey;
  footerText: string;
  offsetMiddle: boolean;
}
