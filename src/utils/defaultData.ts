import type { Article, TimelineEvent, ThemeConfig, SiteConfig, TagMeta } from "../types";

export const defaultTheme: ThemeConfig = {
  primaryColor: "#6366f1",
  accentColor: "#ec4899",
  backgroundColor: "#fafafa",
  surfaceColor: "#ffffff",
  textColor: "#1a1a2e",
  fontFamily: "sans",
  borderRadius: 12,
  layout: "grid",
  cardStyle: "shadow",
};

export const defaultSite: SiteConfig = {
  siteName: "dolihame",
  author: "dolihame",
  description: "探索技术边界，记录生活点滴",
  avatar: null,
  logoImage: null,
  social: {
    github: "https://github.com/dolihame",
    email: "hello@dolihame.com",
    website: "https://dolihame.com",
  },
  aboutContent: `## 关于我

你好，我是 **dolihame**。

一名热爱技术与创造的开发者。这个博客是我记录学习、分享思考的地方。

### 技能栈

- **前端**: React, TypeScript, Vue, Tailwind CSS
- **后端**: Node.js, Python, Go
- **工具**: Git, Docker, Vite

### 联系方式

- GitHub: [@dolihame](https://github.com/dolihame)
- Email: hello@dolihame.com

> "Stay hungry, stay foolish."`,
};

export const defaultArticles: Article[] = [
  {
    id: "article-1",
    title: "欢迎来到 dolihame 的博客",
    content: `# 欢迎来到 dolihame 的博客

这是博客的第一篇文章，很高兴能在这里与你相遇。

## 这个博客会写什么？

这个博客将涵盖以下主题：

- **技术分享** — 前端开发、全栈架构、性能优化
- **学习笔记** — 读书笔记、课程总结
- **生活随笔** — 旅行见闻、日常思考
- **项目复盘** — 从零到一的实践经验

## 代码示例

这是一个简单的 React 组件示例：

\`\`\`tsx
function Welcome({ name }: { name: string }) {
  return <h1>你好，{name}！</h1>;
}

export default Welcome;
\`\`\`

## 功能特性

> 这个博客支持完整的 Markdown 渲染，包括表格、列表、引用等。

| 功能 | 状态 |
|------|------|
| Markdown 渲染 | ✅ |
| 图片上传 | ✅ |
| 标签分类 | ✅ |
| 时间轴 | ✅ |
| 主题自定义 | ✅ |

感谢你的来访，希望这里的内容对你有帮助。`,
    excerpt: "这是博客的第一篇文章，很高兴能在这里与你相遇。这个博客将涵盖技术分享、学习笔记、生活随笔等内容。",
    tags: ["公告", "随笔"],
    coverImage: null,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    published: true,
  },
  {
    id: "article-2",
    title: "使用 React 和 TypeScript 构建现代博客",
    content: `# 使用 React 和 TypeScript 构建现代博客

在这篇文章中，我将分享如何从零开始构建一个现代化的个人博客系统。

## 技术选型

### 前端框架

我们选择了 **React 18** 作为前端框架，原因如下：

1. 生态系统成熟，社区活跃
2. TypeScript 支持完善
3. 性能优化方案丰富

### 样式方案

使用 **Tailwind CSS** 进行样式开发：

\`\`\`tsx
<div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
  <h2 className="text-2xl font-bold text-gray-900">文章标题</h2>
  <p className="text-gray-600 mt-2">文章摘要内容...</p>
</div>
\`\`\`

## 架构设计

### 数据流

\`\`\`
用户操作 → Context Action → localStorage 更新 → 组件重新渲染
\`\`\`

### 组件结构

- **Layout** — 页面骨架
- **Navbar** — 导航栏
- **ArticleCard** — 文章卡片
- **MarkdownRenderer** — Markdown 渲染器

## 总结

构建一个博客系统并不复杂，关键在于做好数据管理和用户体验。

> 好的架构不是一开始就设计出来的，而是在迭代中逐渐演进的。`,
    excerpt: "分享如何从零开始构建一个现代化的个人博客系统，包括技术选型、架构设计和核心功能实现。",
    tags: ["技术", "React", "TypeScript"],
    coverImage: null,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    published: true,
  },
  {
    id: "article-3",
    title: "我的 2026 年读书清单",
    content: `# 我的 2026 年读书清单

新的一年，给自己列了一份读书清单，涵盖技术、人文和小说。

## 技术类

1. **《深入理解计算机系统》** — 打牢底层基础
2. **《设计模式之美》** — 提升架构思维
3. **《重构：改善既有代码的设计》** — 让代码更优雅

## 人文类

1. **《人类简史》** — 尤瓦尔·赫拉利
2. **《思考，快与慢》** — 丹尼尔·卡尼曼

## 小说类

1. **《三体》三部曲** — 刘慈欣
2. **《活着》** — 余华

---

> 读书不是为了雄辩和驳斥，也不是为了轻信和盲从，而是为了思考和权衡。 —— 培根

每月会更新读书进度，敬请期待！`,
    excerpt: "新的一年，给自己列了一份读书清单，涵盖技术、人文和小说。包括《深入理解计算机系统》《人类简史》《三体》等。",
    tags: ["生活", "读书"],
    coverImage: null,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    published: true,
  },
];

export const defaultTimelineEvents: TimelineEvent[] = [
  {
    id: "event-1",
    date: new Date(Date.now() - 86400000 * 365).toISOString(),
    title: "开启博客之旅",
    description: "搭建了个人博客，开始记录学习与生活。",
    category: "milestone",
    color: "#6366f1",
  },
  {
    id: "event-2",
    date: new Date(Date.now() - 86400000 * 180).toISOString(),
    title: "学习 React 18",
    description: "系统学习了 React 18 的新特性，包括并发渲染和 Suspense。",
    category: "study",
    color: "#10b981",
  },
  {
    id: "event-3",
    date: new Date(Date.now() - 86400000 * 90).toISOString(),
    title: "完成第一个开源项目",
    description: "在 GitHub 上发布了第一个开源项目，获得了 100+ Star。",
    category: "work",
    color: "#f59e0b",
  },
  {
    id: "event-4",
    date: new Date().toISOString(),
    title: "博客全新改版",
    description: "使用 React + TypeScript + Tailwind CSS 全新重构了博客系统。",
    category: "milestone",
    color: "#ec4899",
  },
];

export const defaultTagMetas: TagMeta[] = [
  { name: "公告", color: "#3b82f6", description: "博客公告与通知" },
  { name: "随笔", color: "#8b5cf6", description: "生活随笔与思考" },
  { name: "技术", color: "#10b981", description: "技术分享与笔记" },
  { name: "React", color: "#06b6d4", description: "React 相关内容" },
  { name: "TypeScript", color: "#2563eb", description: "TypeScript 相关内容" },
  { name: "生活", color: "#f59e0b", description: "日常生活记录" },
  { name: "读书", color: "#ef4444", description: "读书笔记与推荐" },
];
