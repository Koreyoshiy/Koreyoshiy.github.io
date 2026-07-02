# Koreyoshiy Blog

Koreyoshiy 的个人博客源码，使用 Hexo 8、FlatPaper 主题与 GitHub Pages 构建。

- 线上地址：<https://koreyoshiy.github.io/>
- 源码分支：`source`
- 自动部署：推送到 `source` 后，由 GitHub Actions 构建并发布

## 本地运行

需要 Node.js 22 和 pnpm 10。

```bash
git clone --recurse-submodules https://github.com/Koreyoshiy/Koreyoshiy.github.io.git
cd Koreyoshiy.github.io
pnpm install
pnpm server
```

浏览器访问 <http://localhost:4000/>。

## 写一篇文章

```bash
pnpm new post "文章标题"
```

然后编辑 `source/_posts/文章标题.md`。预览无误后提交并推送：

```bash
git add .
git commit -m "post: 添加文章标题"
git push origin source
```

## 常用命令

```bash
pnpm server  # 本地预览
pnpm build   # 生成 public 目录
pnpm clean   # 清理生成文件
```

## 项目结构

```text
.
├─ .github/workflows/deploy.yml  # GitHub Pages 自动部署
├─ scaffolds/                    # Markdown 模板
├─ source/
│  ├─ _posts/                    # 博客文章
│  ├─ _data/                     # 友链等结构化数据
│  └─ img/                       # 图片资源
├─ themes/flatpaper/             # FlatPaper Git 子模块
├─ _config.yml                   # Hexo 配置
└─ _config.flatpaper.yml         # FlatPaper 主题配置
```

## 说明

旧的 `main` 分支保存了历史静态页面。日常维护只需要修改 `source` 分支；发布内容由 GitHub Actions 生成，不要手动编辑线上 HTML。

FlatPaper 主题固定为 Git 子模块。已有仓库如缺少主题，可运行：

```bash
git submodule update --init --recursive
```

文章默认采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 协议。
