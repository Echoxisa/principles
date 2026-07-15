# 原则 · 身份

极简本地原则本：记录你**仍选择**的身份原则，以及**不再选择**的轨迹。

想法 · 语言 · 行动 —— 用生活反馈迭代，而不是堆积材料。

| | |
|--|--|
| 在线 | **https://echoxisa.github.io/principles/** |
| 仓库 | https://github.com/Echoxisa/principles |
| 本地 | `/Users/echo/Desktop/principles`（开发机） |

给 AI / 换 agent 时请先读 **[AGENTS.md](./AGENTS.md)**。

---

## 产品意图（不要偏离）

- **是**：当前身份的可编辑清单 + 生活反馈 + 归档轨迹  
- **不是**：知识库、材料编译、RAG、图谱、第二大脑  
- 原则可改、可归档、可恢复；**不选择也是一种选择**（归档保留）  
- 不在本项目上叠复杂后端或新架构，除非用户明确要求  

## 功能

| 功能 | 说明 |
|------|------|
| 生效中 | 增 / 改 / 记反馈 |
| 已不选择 | 归档 + 可选原因；可重新选择或永久删除 |
| 反馈类型 | 想法 / 语言 / 行动 |
| 导出 / 导入 | JSON 备份与迁移 |

## 数据存在哪

- 浏览器 **`localStorage`**，键名：`principles-identity-v1`  
- **无服务器账号、无云同步**  
- 换设备 / 换浏览器 / 清缓存会丢数据 → 用页面「导出」备份  
- 导入会**覆盖**本机现有数据（有确认）  

### 数据形状（导出 JSON）

```json
{
  "principles": [
    {
      "id": "uuid",
      "title": "名称",
      "body": "说明",
      "status": "active | archived",
      "createdAt": "ISO-8601",
      "updatedAt": "ISO-8601",
      "archivedAt": "ISO-8601（可选）",
      "archiveReason": "为何不再选（可选）",
      "feedback": [
        {
          "id": "uuid",
          "kind": "thought | speech | action",
          "text": "记录",
          "at": "ISO-8601"
        }
      ]
    }
  ]
}
```

## 技术栈

- 纯静态：`index.html` + `css/style.css` + `js/app.js`  
- 无构建、无 npm、无后端  
- 托管：GitHub Pages（`main` 分支根目录）  
- `.nojekyll`：避免 Jekyll 处理导致部署失败  

## 目录

```
principles/
├── AGENTS.md          # 给 AI 的维护约定（换 agent 必读）
├── README.md          # 本说明
├── index.html
├── css/style.css
├── js/app.js
└── .nojekyll
```

## 维护与发布

1. 改代码 → 本地用任意静态服务预览（**不要默认占用 8765**，可能与其它项目冲突）  
   ```bash
   cd /Users/echo/Desktop/principles
   python3 -m http.server 5533
   # 打开 http://127.0.0.1:5533
   ```
2. 提交并推送：  
   ```bash
   git add -A && git commit -m "说明改了什么" && git push origin main
   ```
3. 约 1 分钟后刷新 https://echoxisa.github.io/principles/  

GitHub 仓库设置：Pages → Deploy from branch → `main` / `/ (root)`。

## 设计约定

- 色调：暖纸底 + 鼠尾草绿，温和、少装饰  
- 文案：中文、简短、不鸡血  
- 新功能：先问「用户是否真要」，避免堆系统  

## License

MIT
