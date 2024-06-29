# DOL-pancake / DOL烤饼机

本烤饼机用于快速生成高度还原 [Degrees of Lewdity](https://www.vrelnir.com/) 游戏原文的伪截图，亦图帮助文本方面的 MOD 制作，为四处抄代码缝合而来，如有 bug，请多担待，欢迎 issue 或 PR。

## 特性
- 所见即所得，一键导出，简化代码工作量
- 自动转换人称代词，将“他/她”修改为相应代码，且不影响“其他”等词语
- 自动添加数据变化部件，且能识别是否应添加至 `<<link>>` 内
- 自定义部件，减少重复工作
- 插入图片转为 base64 编码

## 计划
由于勉强能用.jpg且作者实力有限，无限鸽，如有实际需求，将更快完成。
- [ ] 差分

## 其他问题
- 部分 Safari 版本 CSS 失效
- Firefox 上输出图片时链接标号无法正常显示（https://github.com/qq15725/modern-screenshot/issues/97）

## 开发
### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

### Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

### Project Setup

```sh
npm install
```

#### Compile and Hot-Reload for Development

```sh
npm run dev
```

#### Compile and Minify for Production

```sh
npm run build
```

#### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
## 感谢
- [modern-screenshot](https://github.com/qq15725/modern-screenshot)
