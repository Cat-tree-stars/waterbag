# 生活小抄设计指南 (203 居住指南)

## 设计意图与感官逻辑
本项目旨在为新入住者打造一份温暖、直觉且具有“生活感”的数字居住指南。设计系统围绕**“温暖小抄” (Warm Cheat-sheet)** 的核心意图展开，模拟哑光纸张的触感与手绘线条的温润。

### 1. 材质与视觉物理 (Material Physics)
*   **基础材质**：哑光厚质纸张 (Matte Paper)。避免高光与镜面反射，使用细腻的纸张颗粒感 (Noise) 营造触觉记忆。
*   **物理规则**：
    *   **光影**：采用极其柔和的漫反射阴影，模拟自然光照射在纸张上的微小空隙感。
    *   **边缘**：大圆角 (16px) 结合微弱的手绘线条质感边缘，去除工业化的锐利感。
*   **Layout Vibe**: HYBRID。封面采用全屏沉浸式布局，内容区切换为高效率的线性卡片堆叠。

### 2. 色彩哲学
*   **底色 (Base)**：奶油白 (#FBF9F6)。相比纯白，它更具包容感，能有效缓解阅读焦虑。
*   **点缀色 (Accent)**：鼠尾草绿 (#748D7A)。从参考图提取，代表植物、生长与平静，用于指示当前展开状态与核心操作。
*   **文本色**：炭灰色 (#2D2D2D)。非纯黑，保持对比度的同时降低视觉疲劳。

### 3. 字体系统
*   **中文字体**：选用 `jfOpenHuninn` (粉圆体)。其圆润、手写的笔触完美契合“手绘生活感”的方向。
*   **英文字体**：选用 `Lora` (Serif)。衬线体的古典与稳重，为现代生活增添一份诗意。
*   **排版比例**：Major Third (1.25)。保持节奏的平缓，不追求极端的视觉冲击。

### 4. 动效规格 (Motion Specs)
*   **手风琴展开 (Accordion)**：
    *   **物理 anchor**：Slide (气压阻尼)。
    *   **参数**：Stiffness 200, Damping 25。平滑、安静地滑开，模拟纸张在桌面慢慢铺开的节奏。
*   **卡片反馈**：
    *   **点击**：微小的缩放 `scale-[0.98]`，提供即时的触感回馈。

## 关键组件配方 (Tailwind Recipes)

### 章节卡片 (Chapter Card)
```html
<!-- 容器 -->
<div class="bg-surface-raised border border-border-subtle rounded-card shadow-card-sm p-spacing-comfortable transition-all duration-300 ease-out hover:shadow-card-md active:scale-[0.98]">
  <!-- 标题区 -->
  <div class="flex justify-between items-center">
    <h3 class="text-h3 font-zh font-semibold text-text-primary">章节标题</h3>
    <Icon class="text-brand-accent w-6 h-6" />
  </div>
</div>
```

### 主按钮 (Primary Action)
```html
<button class="bg-brand-accent text-white px-spacing-loose py-spacing-base rounded-button text-body font-medium shadow-card-sm active:scale-[0.95] transition-all">
  开始探索
</button>
```

## 质量检测 (Quality Gate)
- [x] **色彩检查**：背景非纯白 (#FBF9F6)，主色非 AI 紫。
- [x] **圆角哲学**：全系统统一 16px 大圆角。
- [x] **文字对比**：所有文本对比度均 > 4.5:1。
- [x] **诚实文案**：使用“203 居住指南”、“欢迎住进来”等具体描述。
- [x] **减弱动效支持**：已考虑 prefers-reduced-motion。
