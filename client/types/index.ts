export interface ChildProps {
  children: React.ReactNode;
}

export interface IError extends Error {
  response: { data: { message: string } };
}

export interface IUser {
  email: string;
  _id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  bio: string;
  isVerified: boolean;
  muted: boolean;
  notificationSound: string;
  sendingSound: string;
  contacts: IUser[];
  lastMessage: IMessage | null;
}

export interface IMessage {
  _id: string;
  text: string;
  image: string;
  reaction: string;
  sender: IUser;
  receiver: IUser;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export interface ILInkLinkPreview {
  thumbnail_url: string | null;
  title: string | null;
  description: string | null;
  url: string | null;
}
