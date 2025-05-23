"use client";

import { FullScreenDialog, Button } from "@marvel/ui/ui";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { EventFormData } from "../../types";
import { ScopeEnum } from "@prisma/client";
import EventForm from "../../components/forms/EventForm";

const EventCreatingForm = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const sessionUser = useSession()?.data?.user;
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    caption: "",
    description: "",
    coverPhoto: "",
    typeOfEvent: "EVENT",
    eventStartTime: new Date(),
    eventEndTime: new Date(),
    requiresRegistration: false,
    registrationStartTime: new Date(),
    registrationEndTime: new Date(new Date().setDate(new Date().getDate() + 2)),
    requiresActionButton: false,
    actionLink: "",
    actionText: "",
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: sendMutation, isPending: isCreateLoading } = useMutation({
    mutationFn: async () =>
      (
        await axios.post(`/api/event/create`, {
          ...formData,
        })
      ).data,
    onError: (e: AxiosError) =>
      alert(e?.response?.data?.["message"] || "Something went wrong."),
    onSuccess: () => {
      queryClient.invalidateQueries(["event_list"] as any);
      setDialogOpen(false);
    },
  });

  if (
    ["CRDN", "ADMIN"].some((s) =>
      sessionUser?.scope?.map((s) => s.scope).includes(s as ScopeEnum)
    )
  ) {
    return (
      <>
        <div className="px-3 w-full flex justify-end">
          <Button
            onPress={() => {
              setDialogOpen((p) => !p);
            }}
          >
            Create New Event
          </Button>
        </div>
        {dialogOpen && (
          <FullScreenDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            className="z-10"
          >
            <div className="w-full pb-24">
              <EventForm
                mode="create"
                formData={formData}
                setFormData={setFormData}
                onSubmit={sendMutation}
                submitDisabled={isCreateLoading}
              />
            </div>
          </FullScreenDialog>
        )}
      </>
    );
  } else {
    return <></>;
  }
};

export default EventCreatingForm;
