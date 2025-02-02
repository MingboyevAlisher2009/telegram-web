import { useCurrentContact } from "@/hooks/use-current";
import { CONST } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { IMessage } from "@/types";
import { format } from "date-fns";
import { Check, CheckCheck, Edit2, Trash } from "lucide-react";
import { FC } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu";
import Image from "next/image";
import LinkPreview from "@/app/(chat)/_components/link-preview";

interface Props {
  message: IMessage;
  onReaction: (reaction: string, messageId: string) => Promise<void>;
  onDeleteMessage: (messageId: string) => Promise<void>;
}
const MessageCard: FC<Props> = ({ message, onReaction, onDeleteMessage }) => {
  const { currentContact, setEditedMessage } = useCurrentContact();

  const reactions = [
    "👍",
    "😂",
    "❤️",
    "❤️‍🔥",
    "😍",
    "👎",
    "🔥",
    "👌",
    "🤦‍♂️",
    "😊",
  ];

  return (
    <ContextMenu>
      <ContextMenuTrigger className="rounded" asChild>
        <div
          className={cn(
            "m-2.5 font-medium text-xs flex",
            message.receiver._id === currentContact?._id
              ? "justify-start"
              : "justify-end"
          )}
        >
          <div
            className={cn(
              "relative inline-block p-2 pl-3 pr-12 max-w-[75%] rounded-lg",
              message.receiver._id === currentContact?._id
                ? "bg-primary text-white"
                : "bg-secondary text-gray-900"
            )}
          >
            {message.image && (
              <Image
                src={message.image}
                alt="Image"
                width={200}
                height={150}
                className="rounded-lg mb-2"
              />
            )}

            {message.text.startsWith("https://") ||
            message.text.startsWith("http://") ? (
              <LinkPreview url={message.text} />
            ) : (
              <p className="text-sm break-words">{message.text}</p>
            )}

            {message.reaction && (
              <div
                onClick={() => onReaction(message.reaction, message._id)}
                className="mt-2 flex items-center bg-white/50 p-1 rounded-full text-base w-fit gap-1 cursor-pointer"
              >
                <p>{message.reaction}</p>
              </div>
            )}

            <div className="absolute right-2 bottom-1 opacity-60 text-[9px] flex gap-1 items-center">
              <p>{format(message.updatedAt, "hh:mm")}</p>
              {message.receiver._id === currentContact?._id &&
                (message.status === CONST.READ ? (
                  <CheckCheck size={12} />
                ) : (
                  <Check size={12} />
                ))}
            </div>
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-56 p-0 mb-10">
        <ContextMenuItem className="grid grid-cols-5">
          {reactions.map((reaction) => (
            <div
              key={reaction}
              className={cn(
                "text-xl cursor-pointer p-1 hover:bg-primary/50 transition-all",
                message.reaction === reaction && "bg-primary/50"
              )}
              onClick={() => onReaction(reaction, message._id)}
            >
              {reaction}
            </div>
          ))}
        </ContextMenuItem>
        {message.sender._id !== currentContact?._id && (
          <>
            <ContextMenuSeparator />
            {!message.image && (
              <ContextMenuItem
                className="cursor-pointer"
                onClick={() => setEditedMessage(message)}
              >
                <Edit2 size={14} className="mr-2" />
                <span>Edit</span>
              </ContextMenuItem>
            )}
            <ContextMenuItem
              className="cursor-pointer"
              onClick={() => onDeleteMessage(message._id)}
            >
              <Trash size={14} className="mr-2" />
              <span>Delete</span>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default MessageCard;
