import { EventTypes } from "./event-types.interface";

export interface ToastEvent {
  type: EventTypes;
  title: string;
  message: string;
}