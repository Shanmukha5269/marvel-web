import React from "react";
import { EventFormData } from "../../types";
import { TypeOfEvent } from "database";
import { Button } from "ui";
import { TextField } from "../../components/clientComponents";
import { MarkdownEditor } from "../MarkdownEditor";
import ImageUploader from "../ImageUploader";

type EventFormProps = {
  formData: EventFormData;
  setFormData: (args: EventFormData | any) => void;
  onSubmit?: () => void;
  submitDisabled?: boolean;
  mode: "create" | "edit";
};

const getOffSettedISOString = (date: Date): string => {
  const timezoneOffset = date.getTimezoneOffset() * -1;
  const isoString = new Date(date.getTime() + timezoneOffset * 60 * 1000)
    .toISOString()
    .slice(0, -8);
  return isoString;
};

const getDateOneYearFromThis = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setFullYear(date.getFullYear() + 1);
  return newDate;
};

const EventForm = ({
  formData,
  setFormData,
  onSubmit,
  submitDisabled = false,
  mode,
  ...props
}: EventFormProps) => {
  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit && onSubmit();
      }}
    >
      <label className="text-2xl" htmlFor="event_type">
        Type of Event
      </label>
      <select
        value={formData?.typeOfEvent}
        id="event_type"
        onChange={(e) =>
          setFormData({
            ...formData,
            typeOfEvent: e.target?.value as TypeOfEvent,
          })
        }
        className="w-full p-2 rounded-lg dark:bg-p-2 border-[1.5px] dark:border dark:border-p-6"
      >
        <option value={"EVENT"}>EVENT</option>
        <option value={"WORKSHOP"}>WORKSHOP</option>
        <option value={"COMPETITION"}>COMPETITION</option>
        <option value={"TALK"}>TALK</option>
      </select>
      <label className="text-2xl">About the Event</label>
      <TextField
        fullWidth
        id="title"
        placeholder="Title of the Event"
        type={"text"}
        value={formData?.title}
        onChange={(e) =>
          setFormData((p) => ({
            ...p,
            title: e,
          }))
        }
        maxLength={50}
        isRequired
        minLength={3}
      />
      <TextField
        fullWidth
        id="caption"
        placeholder="A short caption for the event..."
        type={"text"}
        value={formData?.caption}
        onChange={(e) =>
          setFormData((p) => ({
            ...p,
            caption: e,
          }))
        }
        maxLength={200}
        isRequired
        minLength={3}
      />
      <MarkdownEditor
        maxLength={15_000}
        required
        placeholder="Event description. You can also embed Lu.ma Forms, Google Forms, etc"
        value={formData?.description}
        onChange={(e) =>
          setFormData((p) => ({
            ...p,
            description: e?.target?.value,
          }))
        }
      />
      <hr className="w-full" />
      <ImageUploader
        value={formData?.coverPhoto as string}
        onClick={() => {
          setFormData({ ...formData, coverPhoto: "" });
        }}
        onChange={(photo) => {
          setFormData({ ...formData, coverPhoto: photo });
        }}
      />

      {/* event time*/}
      <label htmlFor="start_time" className="text-2xl">
        When does it start?
      </label>
      <input
        required
        min={mode != "edit" ? getOffSettedISOString(new Date()) : undefined}
        max={getOffSettedISOString(getDateOneYearFromThis(new Date()))}
        className="w-full p-2 rounded-lg dark:bg-p-2 border dark:border-p-6"
        id="start_time"
        type="datetime-local"
        value={getOffSettedISOString(formData?.eventStartTime as Date)}
        onChange={(e) =>
          e.target?.value &&
          setFormData({
            ...formData,
            eventStartTime: new Date(e?.target?.value),
          })
        }
      />
      <label htmlFor="end_time" className="text-2xl">
        When does it end?
      </label>
      <input
        required
        min={getOffSettedISOString(formData?.eventStartTime as Date)}
        max={getOffSettedISOString(
          getDateOneYearFromThis(formData?.eventStartTime as Date)
        )}
        className="w-full p-2 rounded-lg dark:bg-p-2 border dark:border-p-6"
        id="end_time"
        type="datetime-local"
        value={getOffSettedISOString(formData?.eventEndTime as Date)}
        onChange={(e) =>
          e.target?.value &&
          setFormData({
            ...formData,
            eventEndTime: new Date(e?.target?.value),
          })
        }
      />

      {/* registration details*/}
      <span className="flex gap-5 items-center">
        <input
          defaultChecked={formData?.requiresRegistration}
          className="w-5 h-5"
          id="require_reg"
          type="checkbox"
          onClick={() =>
            setFormData({
              ...formData,
              requiresRegistration: !formData?.requiresRegistration,
            })
          }
        />
        <label className="text-2xl select-none" htmlFor="require_reg">
          Requires Registration?
        </label>
      </span>

      {formData?.requiresRegistration && (
        <>
          {/* registration time*/}
          <label htmlFor="reg_start_time" className="text-2xl">
            Registration starts at?
          </label>
          <input
            required
            min={
              mode !== "edit" ? getOffSettedISOString(new Date()) : undefined
            }
            max={getOffSettedISOString(formData?.eventStartTime as Date)}
            className="w-full p-2 rounded-lg dark:bg-p-2 border dark:border-p-6"
            id="reg_start_time"
            type="datetime-local"
            value={getOffSettedISOString(
              formData?.registrationStartTime as Date
            )}
            onChange={(e) =>
              e.target?.value &&
              setFormData({
                ...formData,
                registrationStartTime: new Date(e?.target?.value),
              })
            }
          />
          <label htmlFor="reg_end_time" className="text-2xl">
            Registration ends at?
          </label>
          <input
            min={getOffSettedISOString(formData?.registrationStartTime as Date)}
            max={getOffSettedISOString(formData?.eventStartTime as Date)}
            className="w-full p-2 rounded-lg dark:bg-p-2 border dark:border-p-6"
            id="reg_end_time"
            type="datetime-local"
            value={getOffSettedISOString(formData?.registrationEndTime as Date)}
            onChange={(e) =>
              e.target?.value &&
              setFormData({
                ...formData,
                registrationEndTime: new Date(e?.target?.value),
              })
            }
          />
        </>
      )}

      {/* action button details*/}
      <span className="flex gap-5 items-center flex-wrap">
        <input
          defaultChecked={formData?.requiresActionButton}
          className="w-5 h-5"
          id="requires_action"
          type="checkbox"
          onClick={() =>
            setFormData({
              ...formData,
              requiresActionButton: !formData?.requiresActionButton,
            })
          }
        />
        <label
          className="text-2xl select-none flex-1"
          htmlFor="requires_action"
        >
          Display Action Button?
        </label>
        <p className="text-p-5 dark:text-p-6">
          With Action Button, You can display a Button with custom label that
          can redirect to any external site, on the Event Page.{" "}
        </p>
      </span>

      {formData?.requiresActionButton && (
        <>
          {/* registration time*/}
          <label htmlFor="action_link" className="text-2xl">
            Action Link
          </label>
          <TextField
            fullWidth
            id="action_link"
            value={formData?.actionLink}
            isRequired
            minLength={3}
            maxLength={190}
            placeholder="Action Button Link"
            onChange={(e) =>
              setFormData({
                ...formData,
                actionLink: e,
              })
            }
          />
          <label htmlFor="action_label" className="text-2xl">
            Action Label
          </label>
          <TextField
            fullWidth
            id="action_label"
            value={formData?.actionText}
            isRequired
            minLength={3}
            maxLength={30}
            placeholder="Action Button Label"
            onChange={(e) =>
              setFormData({
                ...formData,
                actionText: e,
              })
            }
          />
        </>
      )}
      <div className="w-full flex gap-5 justify-end pb-48 mt-5">
        <Button type="submit" isDisabled={submitDisabled}>
          Submit
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
