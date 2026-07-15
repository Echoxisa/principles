# AGENTS.md — 给 AI 的协作说明

换 Claude / Codex / Grok / Cursor 时先读本文件 + `README.md`。

## 这是什么

用户（皙）的**身份原则**小工具：只管理「我仍选择 / 我已不选择」的原则，以及想法·语言·行动反馈。

**不是** `_me`、Obsidian 知识库、材料 ingest、原则可视化图谱的扩展。不要把两者合并，除非用户明确要求。

## 硬约束

1. **保持极简**。无后端、无构建、无框架，除非用户点名要加。  
2. **先验证需求**。提功能前问：这是不是她真要的？不是则不做。  
3. **数据本地**。默认 `localStorage`；改存储键或 schema 必须兼容或提供迁移 + 更新 README。  
4. **归档不是删除**。`status: archived` 保留轨迹；永久删除要二次确认。  
5. **中文 UI**。温和色调，避免花哨、emoji 堆砌。  
6. **部署**：推 `main` 即 GitHub Pages；保留 `.nojekyll`。  

## 关键文件

| 文件 | 职责 |
|------|------|
| `index.html` | 结构、对话框 |
| `css/style.css` | 温和主题 |
| `js/app.js` | 状态、localStorage、渲染、导入导出 |
| `README.md` | 人读说明与数据 schema |

入口逻辑全在 `js/app.js`：`STORAGE_KEY`、`load`/`save`、`render`。

## 常见改动

| 需求 | 改哪里 |
|------|--------|
| 文案 / 按钮 | `index.html`、`js/app.js` 中文串 |
| 颜色 / 间距 | `css/style.css` 的 `:root` |
| 字段 / schema | `js/app.js` + README 数据形状 |
| 存储键名 | `STORAGE_KEY`（改则写迁移） |

## 本地预览

```bash
cd /path/to/principles
python3 -m http.server 5533   # 避开 8765 等已占用端口
```

## 发布检查清单

- [ ] 生效 / 归档 / 恢复 / 永久删除可用  
- [ ] 反馈三种类型可写  
- [ ] 导出 JSON → 清空或换浏览器 → 导入仍正常  
- [ ] 推送 `main` 后 Pages 能打开  
- [ ] README / 本文件若行为有变则已更新  

## 不要做

- 不要默认接数据库、账号系统、AI 自动写原则  
- 不要为了「更完整」加材料库、图谱、多端同步（除非用户明确要）  
- 不要把其它项目的端口写死进文档当唯一方式  

## 用户背景（协作时）

- 称呼：皙  
- 原则应服务「经验身份」：生活反馈 > 同义理论材料  
- AI 是工具：她决策，你实现；避免替她做人生最优选择  
