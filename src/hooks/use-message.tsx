"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMessage,
  deleteMessage,
  getAllMessages,
  updateMessage,
} from "@/actions/message.actions";
import { toast } from "sonner";
import { messages } from "@/services/db/schema/message.schema";
// ~ =============================================>
// ~ ======= Main Hook  -->
// ~ =============================================>
export const useMessage = () => {
  // ~ ======= Get all messages  -->
  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["messages"],
    queryFn: getAllMessages,
  });

  return { messages, isLoadingMessages };
};

// ~ =============================================>
// ~ ======= Mutation Hooks  -->
// ~ =============================================>
export const useMutateMessage = () => {
  const queryClient = useQueryClient();

  // ~ ======= Create message  -->
  const { mutate: sendMessage, isPending: isCreatingMessage } = useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Message received!", {
        description:
          "We have received your message successfully and would be getting back to you via email.",
      });
    },
    onError: (error) => {
      toast.error("Failed to send message");
    },
  });

  // ~ ======= Update message  -->
  const { mutate: updateSingleMessage, isPending: isUpdatingMessage } =
    useMutation({
      mutationFn: async (args: {
        messageId: string;
        updateContent: Partial<typeof messages.$inferSelect>;
      }) => await updateMessage(args.messageId, args.updateContent),

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["messages"] });
        toast.success("Message updated successfully");
      },
      onError: () => {
        toast.error("Failed to update message");
      },
    });

  // ~ ======= Delete message  -->
  const { mutate: deleteSingleMessage, isPending: isDeletingMessage } =
    useMutation({
      mutationFn: async (messageId: string) => await deleteMessage(messageId),

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["messages"] });
        toast.success("Message deleted successfully");
      },

      onError: () => {
        toast.error("Failed to delete message");
      },
    });

  return {
    sendMessage,
    isCreatingMessage,
    updateSingleMessage,
    isUpdatingMessage,
    deleteSingleMessage,
    isDeletingMessage,
  };
};
