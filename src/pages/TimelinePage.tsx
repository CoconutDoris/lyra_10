import { Clock } from "lucide-react";
import TimelineEditor from "../components/TimelineEditor";

export default function TimelinePage() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Clock size={28} style={{ color: "var(--color-primary)" }} />
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-text)" }}>时间轴</h1>
      </div>
      <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
        记录成长路上的每一个重要时刻。你可以自由添加、编辑、删除时间轴事件。
      </p>
      <TimelineEditor />
    </div>
  );
}
