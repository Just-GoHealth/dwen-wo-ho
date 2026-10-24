import { atom } from "jotai";
import { CuratorNotification } from "@/lib/types/entities/notification";

export const curatorNotificationListAtom = atom<CuratorNotification[]>([]);

export const isCuratorNotificationSheetOpenAtom = atom<boolean>(false);

export const isProviderNotificationSheetOpenAtom = atom<boolean>(false);
