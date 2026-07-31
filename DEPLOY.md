# dolihame 博客 - GitHub Pages 部署指南

## 你需要做的（3 步）

### 第 1 步：在 GitHub 上创建仓库

1. 打开 https://github.com/new
2. **Repository name** 填入：`lyra_10`
3. 选择 **Public**（必须公开，否则 Pages 不可用）
4. **不要**勾选 "Add a README file"
5. 点击 **Create repository**

### 第 2 步：推送代码

创建好仓库后，GitHub 会显示一个类似这样的地址：
```
https://github.com/你的用户名/lyra_10.git
```

复制这个地址，然后在本项目目录下运行：

```bash
cd blog-dolihame

# 添加远程仓库（把 你的用户名 替换成你的 GitHub 用户名）
git remote add origin https://github.com/你的用户名/lyra_10.git

# 推送代码
git push -u origin main
```

> 第一次推送时，Windows 会自动弹出 GitHub 登录窗口，登录即可。

### 第 3 步：开启 GitHub Pages

1. 打开你的仓库页面：`https://github.com/你的用户名/lyra_10`
2. 点击 **Settings** → 左侧菜单找到 **Pages**
3. **Source** 选择 **GitHub Actions**
4. 完成！GitHub 会自动构建并部署

部署完成后，你的博客地址是：
```
https://你的用户名.github.io/lyra_10/
```

---

## 后续更新

以后修改了博客内容后，只需要：

```bash
cd blog-dolihame
git add -A
git commit -m "更新博客"
git push
```

GitHub Actions 会自动重新构建和部署，约 1-2 分钟后更新生效。

---

## 常见问题

### Q: 推送时提示没有权限？
A: Windows 会弹出 Git Credential Manager 窗口，选择 "Sign in with your browser" 用 GitHub 账号登录即可。

### Q: Pages 部署后页面空白？
A: 确认 Settings → Pages 中 Source 选的是 "GitHub Actions"，不是 "Deploy from a branch"。

### Q: 想换成自己的域名？
A: 在 Settings → Pages → Custom domain 中填入你的域名，然后在域名 DNS 中添加 CNAME 记录指向 `你的用户名.github.io`。
