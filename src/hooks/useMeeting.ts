import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  MeetingData,
  SyncStatus,
  createDefaultMeetingData,
  loadActiveMeeting,
  saveMeeting,
  createMeeting,
  lockMeeting,
} from "@/lib/meetingData";
import { toast } from "sonner";

export function useMeeting() {
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [data, setData] = useState<MeetingData>(createDefaultMeetingData());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("synced");
  const [loading, setLoading] = useState(true);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  // Load or create active meeting
  useEffect(() => {
    async function init() {
      try {
        const existing = await loadActiveMeeting();
        if (existing) {
          setMeetingId(existing.id);
          setData(existing.data as unknown as MeetingData);
        } else {
          const defaultData = createDefaultMeetingData();
          const created = await createMeeting(defaultData);
          setMeetingId(created.id);
          setData(defaultData);
        }
      } catch (err) {
        console.error("Failed to load meeting:", err);
        toast.error("Failed to load meeting data");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Real-time subscription
  useEffect(() => {
    if (!meetingId) return;

    const channel = supabase
      .channel(`meeting-${meetingId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "meetings", filter: `id=eq.${meetingId}` },
        (payload) => {
          const newData = payload.new.data as unknown as MeetingData;
          if (newData) {
            setData(newData);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [meetingId]);

  // Auto-save with debounce
  const triggerSave = useCallback(() => {
    if (!meetingId) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    setSyncStatus("saving");
    saveTimerRef.current = setTimeout(async () => {
      try {
        await saveMeeting(meetingId, dataRef.current);
        setSyncStatus("synced");
      } catch (err) {
        console.error("Save error:", err);
        setSyncStatus("error");
        toast.error("Failed to save");
      }
    }, 700);
  }, [meetingId]);

  const updateData = useCallback(
    (updater: (prev: MeetingData) => MeetingData) => {
      setData((prev) => {
        const next = updater(prev);
        return next;
      });
      triggerSave();
    },
    [triggerSave]
  );

  const handleLock = useCallback(async () => {
    if (!meetingId) return;
    try {
      await lockMeeting(meetingId, dataRef.current);
      toast.success("Meeting saved to history!");
      // Create next week's meeting
      const nextData = createDefaultMeetingData();
      // Roll forward incomplete todos
      const incompleteTodos = dataRef.current.newTodos.filter(
        (t) => t.text && !("done" in t && t.done)
      );
      nextData.priorTodos = [
        ...incompleteTodos.map((t) => ({ ...t, done: false })),
        ...nextData.priorTodos,
      ].slice(0, 7);
      // Set next Monday
      const nextMonday = new Date();
      nextMonday.setDate(nextMonday.getDate() + (8 - nextMonday.getDay()) % 7);
      nextData.meetingDate = nextMonday.toISOString().split("T")[0];

      const created = await createMeeting(nextData);
      setMeetingId(created.id);
      setData(nextData);
    } catch (err) {
      console.error("Lock error:", err);
      toast.error("Failed to save meeting");
    }
  }, [meetingId]);

  return { meetingId, data, updateData, syncStatus, loading, handleLock };
}
