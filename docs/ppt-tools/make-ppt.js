// DEEPHARNESS 产品介绍 PPT 生成脚本 (pptxgenjs)
// 输出: D:\codee\code8\docs\DEEPHARNESS-介绍.pptx
const path = require('path');
const pptx = require('pptxgenjs');

const p = new pptx();
p.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 in
p.author = 'NANTI34';
p.title = 'DEEPHARNESS - DeepSeek Harness Windows 桌面版';

// ---------- 配色 ----------
const INK     = '0F172A'; // 深色背景
const NAVY    = '1E3A8A';
const PRIMARY = '4D6BFE'; // DeepSeek 蓝
const VIOLET  = '7C3AED';
const LIGHT   = 'F4F7FF'; // 浅背景
const CARD    = 'FFFFFF';
const TEXT    = '1E293B';
const MUTED   = '64748B';
const GREEN   = '059669';
const GOLD    = 'D97706';
const WHITE   = 'FFFFFF';
const LINE    = 'DCE4F8';

const FONT = 'Microsoft YaHei';
const MONO = 'Consolas';

// ---------- 工具函数 ----------
let pageNo = 0;
function newSlide(bgColor) {
  const s = p.addSlide();
  pageNo++;
  s.background = { color: bgColor };
  return s;
}
function footer(s, dark) {
  s.addText('DEEPHARNESS · DeepSeek Harness Windows 桌面版', {
    x: 0.6, y: 7.08, w: 8, h: 0.3, fontSize: 9, color: dark ? '64748B' : '94A3B8', fontFace: FONT,
  });
  s.addText(String(pageNo).padStart(2, '0'), {
    x: 12.35, y: 7.08, w: 0.6, h: 0.3, fontSize: 10, color: dark ? '64748B' : '94A3B8',
    fontFace: FONT, align: 'right', charSpacing: 1,
  });
}
function pageTitle(s, num, text) {
  s.addShape('roundRect', { x: 0.6, y: 0.42, w: 0.62, h: 0.62, rectRadius: 0.16, fill: { color: PRIMARY }, line: { type: 'none' }, shadow: { type: 'outer', color: '4D6BFE', opacity: 0.35, blur: 8, offset: 2, angle: 90 } });
  s.addText(num, { x: 0.6, y: 0.42, w: 0.62, h: 0.62, fontSize: 17, bold: true, color: WHITE, fontFace: FONT, align: 'center', valign: 'middle' });
  s.addText(text, { x: 1.42, y: 0.38, w: 10.5, h: 0.7, fontSize: 30, bold: true, color: TEXT, fontFace: FONT, valign: 'middle' });
}
function card(s, x, y, w, h, fill) {
  return s.addShape('roundRect', {
    x, y, w, h, rectRadius: 0.12, fill: { color: fill || CARD },
    line: { color: LINE, width: 1 },
    shadow: { type: 'outer', color: '1E293B', opacity: 0.10, blur: 6, offset: 2, angle: 90 },
  });
}
function iconCircle(s, x, y, d, emoji) {
  s.addShape('ellipse', { x, y, w: d, h: d, fill: { color: 'E8EDFF' }, line: { type: 'none' } });
  s.addText(emoji, { x, y, w: d, h: d, fontSize: d * 36, align: 'center', valign: 'middle', fontFace: 'Segoe UI Emoji' });
}
function arrow(s, x, y, w, color) {
  s.addShape('rightArrow', { x, y, w, h: 0.32, fill: { color: color || 'C7D4FF' }, line: { type: 'none' } });
}

// ================= 1. 封面(深色) =================
{
  const s = newSlide(INK);
  s.addShape('ellipse', { x: 9.6, y: -2.2, w: 7, h: 7, fill: { color: '1E3A8A', transparency: 70 }, line: { type: 'none' } });
  s.addShape('ellipse', { x: -2.4, y: 4.6, w: 6, h: 6, fill: { color: '4D6BFE', transparency: 78 }, line: { type: 'none' } });
  const logo = path.resolve(path.join(__dirname, '..', '..', 'tools', 'logo.png'));
  s.addImage({ path: logo, x: 5.42, y: 1.05, w: 2.5, h: 2.5 });
  s.addText('DEEPHARNESS', { x: 1.5, y: 3.72, w: 10.33, h: 1.0, fontSize: 54, bold: true, color: WHITE, fontFace: FONT, align: 'center' });
  s.addText('DeepSeek Harness · Windows 桌面版', {
    x: 1.5, y: 4.72, w: 10.33, h: 0.55, fontSize: 21, color: 'A5B4FC', fontFace: FONT, align: 'center', charSpacing: 2,
  });
  s.addText('桌面快捷方式,一键打开你的 AI 工作台', {
    x: 1.5, y: 5.42, w: 10.33, h: 0.5, fontSize: 15, color: '94A3B8', fontFace: FONT, align: 'center',
  });
  s.addText('基于 @deepseek-ai/dsh v0.1.0-rc.6 · MIT License · 2026', {
    x: 1.5, y: 6.55, w: 10.33, h: 0.4, fontSize: 11, color: '64748B', fontFace: FONT, align: 'center',
  });
}

// ================= 2. 目录 =================
{
  const s = newSlide(LIGHT);
  pageTitle(s, '01', '目录');
  const items = [
    ['背景与动机', '为什么需要桌面化', '🚀'],
    ['产品特性', '六大核心亮点', '✨'],
    ['工作流程', '从双击到打开界面', '⚙️'],
    ['快速开始', '三步完成安装', '📦'],
    ['数据与安全', '本地优先的设计', '🔒'],
    ['开源与展望', 'MIT 与未来规划', '🌟'],
  ];
  items.forEach((it, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.6 + col * 4.15, y = 1.7 + row * 2.45;
    card(s, x, y, 3.85, 2.05);
    iconCircle(s, x + 0.32, y + 0.32, 0.72, it[2]);
    s.addText(String(i + 1).padStart(2, '0'), { x: x + 2.75, y: 0.28 + y, w: 0.85, h: 0.5, fontSize: 26, bold: true, color: 'D5DDF5', fontFace: FONT, align: 'right' });
    s.addText(it[0], { x: x + 1.24, y: y + 0.34, w: 2.3, h: 0.5, fontSize: 17, bold: true, color: TEXT, fontFace: FONT });
    s.addText(it[1], { x: x + 1.24, y: y + 0.92, w: 2.35, h: 0.4, fontSize: 12, color: MUTED, fontFace: FONT });
  });
  footer(s, true);
}

// ================= 3. 背景与动机 =================
{
  const s = newSlide(LIGHT);
  pageTitle(s, '02', '背景与动机');
  // 左: DeepSeek Harness 是什么
  s.addText('DeepSeek Harness 是什么?', { x: 0.6, y: 1.42, w: 5.6, h: 0.5, fontSize: 19, bold: true, color: PRIMARY, fontFace: FONT });
  card(s, 0.6, 2.0, 5.6, 4.0);
  s.addText([
    { text: 'DeepSeek Harness (DSH) 是 DeepSeek 官方开源的 AI 智能体工作台:', options: { breakLine: true, paraSpaceAfter: 10 } },
    { text: '• 运行在你自己电脑上的全栈 Agent 运行时', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: '• 浏览器操作界面,对话式管理任务', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: '• 技能(Skill)系统,可扩展工具集', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: '• 多模型路由、沙箱文件系统、子代理编排', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: '• 数据 100% 保存在本地', options: { bullet: true } },
  ], { x: 0.95, y: 2.32, w: 4.95, h: 3.3, fontSize: 13.5, color: TEXT, fontFace: FONT, valign: 'top', lineSpacingMultiple: 1.15 });

  // 右: 三个痛点
  s.addText('三个日常痛点,一个解法', { x: 6.75, y: 1.42, w: 5.9, h: 0.5, fontSize: 19, bold: true, color: PRIMARY, fontFace: FONT });
  const pains = [
    ['⌨️', '每次都要敲命令启动', '双击桌面快捷方式,自动检测与拉起服务'],
    ['🪟', '命令行窗口难看、易误关', '无控制台窗口,服务静默常驻后台'],
    ['❓', '不知道服务是否在运行', '启动器先探测端口,复用已有实例'],
  ];
  pains.forEach((p2, i) => {
    const y = 2.0 + i * 1.36;
    card(s, 6.75, y, 5.9, 1.2);
    iconCircle(s, 7.05, y + 0.24, 0.72, p2[0]);
    s.addText(p2[1], { x: 8.0, y: y + 0.14, w: 4.4, h: 0.45, fontSize: 14.5, bold: true, color: TEXT, fontFace: FONT });
    s.addText(p2[2], { x: 8.0, y: y + 0.6, w: 4.4, h: 0.4, fontSize: 11.5, color: MUTED, fontFace: FONT });
  });
  footer(s, true);
}

// ================= 4. 产品定位 =================
{
  const s = newSlide(INK);
  s.addShape('ellipse', { x: 10.6, y: -1.8, w: 5.5, h: 5.5, fill: { color: '4D6BFE', transparency: 80 }, line: { type: 'none' } });
  s.addText('产品定位', { x: 0.6, y: 0.5, w: 8, h: 0.55, fontSize: 24, bold: true, color: 'A5B4FC', fontFace: FONT, charSpacing: 3 });
  s.addText('把 DeepSeek Harness 变成\n"双击即用"的 Windows 桌面应用', {
    x: 0.6, y: 1.15, w: 12.1, h: 1.9, fontSize: 40, bold: true, color: WHITE, fontFace: FONT, valign: 'middle',
  });
  const stats = [
    ['1', '键启动', '桌面快捷方式,零命令'],
    ['2', '个入口', 'Electron 原生窗口 / 浏览器回退'],
    ['100%', '数据本地', '全部保存在 %USERPROFILE%\\.dsh'],
    ['0', '行命令日常使用', '安装一次,日常双击即可'],
  ];
  stats.forEach((st, i) => {
    const x = 0.6 + i * 3.1;
    card(s, x, 4.3, 2.85, 2.0, '1B2545');
    s.addText(st[0], { x: x + 0.2, y: 4.55, w: 2.45, h: 0.95, fontSize: 40, bold: true, color: '7C9BFF', fontFace: FONT, align: 'center' });
    s.addText(st[1], { x: x + 0.2, y: 5.5, w: 2.45, h: 0.4, fontSize: 14, bold: true, color: WHITE, fontFace: FONT, align: 'center' });
    s.addText(st[2], { x: x + 0.2, y: 5.9, w: 2.45, h: 0.32, fontSize: 10, color: '94A3B8', fontFace: FONT, align: 'center' });
  });
  footer(s, false);
}

// ================= 5. 功能特性 =================
{
  const s = newSlide(LIGHT);
  pageTitle(s, '03', '六大核心特性');
  const feats = [
    ['🚀', '一键启动', '检测服务状态 → 后台拉起 → 自动打开界面,全程静默'],
    ['🧠', '智能探测', 'TCP 探测 + __DSH_BOOT__ + API 三重确认,绝不误开'],
    ['🖥️', '原生桌面窗口', 'Electron 应用壳:独立窗口、无地址栏、窗口状态记忆'],
    ['🧩', '常驻增强插件', '文件视图 / 终端 / 外观 / 费用估算,随服务自动加载'],
    ['💾', '数据本地', '会话 / 技能 / 配置保存在 .dsh,不依赖云端'],
    ['⚖️', 'MIT 开源', '基于 MIT 协议,上游来自 DeepSeek 官方项目'],
  ];
  feats.forEach((f, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.6 + col * 4.15, y = 1.75 + row * 2.55;
    card(s, x, y, 3.85, 2.25);
    iconCircle(s, x + 0.35, y + 0.35, 0.85, f[0]);
    s.addText(f[1], { x: x + 1.4, y: y + 0.42, w: 2.2, h: 0.55, fontSize: 17, bold: true, color: TEXT, fontFace: FONT });
    s.addText(f[2], { x: x + 0.35, y: y + 1.4, w: 3.2, h: 0.72, fontSize: 11.5, color: MUTED, fontFace: FONT, valign: 'top' });
  });
  footer(s, true);
}

// ================= 6. 工作流程 =================
{
  const s = newSlide(LIGHT);
  pageTitle(s, '04', '从双击到打开界面');
  // 第一行: 四个步骤
  const steps = [
    ['🖱️', '双击快捷方式', 'DEEPHARNESS.lnk → electron.exe'],
    ['🔒', '单实例锁', '重复双击聚焦已有窗口'],
    ['⚡', '主进程逻辑', 'desktop\\main.js 探测 / 拉起'],
    ['🔍', '端口探测', '3080 已就绪?'],
  ];
  steps.forEach((st, i) => {
    const x = 0.6 + i * 3.08;
    card(s, x, 1.6, 2.75, 1.55);
    iconCircle(s, x + 0.3, 1.85, 0.62, st[0]);
    s.addText(st[1], { x: x + 1.02, y: 1.82, w: 1.6, h: 0.4, fontSize: 13.5, bold: true, color: TEXT, fontFace: FONT, valign: 'middle' });
    s.addText(st[2], { x: x + 0.3, y: 2.55, w: 2.2, h: 0.4, fontSize: 10.5, color: MUTED, fontFace: FONT });
    if (i < 3) arrow(s, x + 2.75, 2.22, 0.33);
  });
  // 菱形判断
  s.addShape('diamond', { x: 4.92, y: 3.5, w: 3.5, h: 1.35, fill: { color: 'FFF7E6' }, line: { color: GOLD, width: 1.5 } });
  s.addText('是 DSH 服务?', { x: 4.92, y: 3.82, w: 3.5, h: 0.45, fontSize: 14, bold: true, color: GOLD, fontFace: FONT, align: 'center' });
  s.addText('端口探测 + 页面标记双重确认', { x: 4.92, y: 4.24, w: 3.5, h: 0.35, fontSize: 9.5, color: 'B45309', fontFace: FONT, align: 'center' });
  s.addShape('downArrow', { x: 6.49, y: 3.1, w: 0.35, h: 0.4, fill: { color: 'C7D4FF' }, line: { type: 'none' } });
  // 两分支
  card(s, 0.6, 5.35, 3.85, 1.35, 'ECFDF5');
  s.addText('✅ 已在运行 → 直接复用', { x: 0.85, y: 5.55, w: 3.4, h: 0.45, fontSize: 14, bold: true, color: GREEN, fontFace: FONT });
  s.addText('不重复启动;工作区不一致时给出警告', { x: 0.85, y: 6.05, w: 3.4, h: 0.4, fontSize: 11.5, color: '065F46', fontFace: FONT });
  card(s, 8.85, 5.35, 3.85, 1.35, 'FEF2F2');
  s.addText('🔄 未运行 → 后台启动服务', { x: 9.1, y: 5.55, w: 3.4, h: 0.45, fontSize: 14, bold: true, color: 'DC2626', fontFace: FONT });
  s.addText('node app\\lib\\bin.js web,等待就绪(≤120s)', { x: 9.1, y: 6.05, w: 3.4, h: 0.4, fontSize: 11, color: '991B1B', fontFace: MONO });
  s.addShape('line', { x: 4.5, y: 4.17, w: 2.5, h: 0, line: { color: 'C7D4FF', width: 2 } });
  s.addShape('line', { x: 6.67, y: 4.85, w: 0, h: 0.5, line: { color: 'C7D4FF', width: 2 } });
  s.addShape('line', { x: 6.67, y: 5.35, w: 2.18, h: 0, line: { color: 'C7D4FF', width: 2 } });
  s.addShape('line', { x: 2.52, y: 4.85, w: 0, h: 0.5, line: { color: 'C7D4FF', width: 2 } });
  // 汇合 → 打开原生窗口
  s.addText('🪟 打开 Electron 原生窗口 → http://127.0.0.1:3080 → DeepSeek Harness 工作台', {
    x: 0.6, y: 6.82, w: 12.1, h: 0.42, fontSize: 13, bold: true, color: PRIMARY, fontFace: FONT, align: 'center',
  });
  footer(s, true);
}

// ================= 7. 架构设计 =================
{
  const s = newSlide(LIGHT);
  pageTitle(s, '05', '四层架构设计');
  const layers = [
    ['🖥️', '交互层', 'Electron 桌面壳 desktop\\main.js(原生窗口)· 浏览器回退入口', '用户每天接触的入口'],
    ['⚙️', '启动层', '单实例锁 + 端口/页面/API 探测 + 后台拉起 + 工作区检查', '核心智能:探测与拉起'],
    ['🧩', '服务层', 'node app\\lib\\bin.js web · 仅绑定 127.0.0.1:3080', 'DeepSeek Harness 运行时'],
    ['💾', '数据层', '%USERPROFILE%\\.dsh(配置 / 会话 / 技能 / 沙箱)', '数据完全本地化'],
  ];
  layers.forEach((ly, i) => {
    const y = 1.55 + i * 1.32;
    card(s, 0.6, y, 12.13, 1.1);
    iconCircle(s, 0.92, y + 0.2, 0.7, ly[0]);
    s.addText(ly[1], { x: 1.85, y: y + 0.16, w: 1.4, h: 0.4, fontSize: 16, bold: true, color: PRIMARY, fontFace: FONT });
    s.addText(ly[2], { x: 1.85, y: y + 0.58, w: 7.6, h: 0.38, fontSize: 11.5, color: TEXT, fontFace: MONO, valign: 'middle' });
    s.addText(ly[3], { x: 9.7, y: y + 0.35, w: 2.75, h: 0.42, fontSize: 11, color: MUTED, fontFace: FONT, align: 'right', valign: 'middle' });
    if (i < 3) s.addShape('downArrow', { x: 6.49, y: y + 1.1, w: 0.35, h: 0.22, fill: { color: 'C7D4FF' }, line: { type: 'none' } });
  });
  footer(s, true);
}

// ================= 8. 双入口对比 =================
{
  const s = newSlide(LIGHT);
  pageTitle(s, '06', '两个使用入口');
  // 左卡
  card(s, 0.6, 1.7, 5.85, 3.6);
  iconCircle(s, 1.0, 2.1, 0.8, '🪟');
  s.addText('DEEPHARNESS', { x: 2.0, y: 2.15, w: 4.1, h: 0.5, fontSize: 19, bold: true, color: TEXT, fontFace: FONT });
  s.addText('Electron 原生应用窗口(主入口)', { x: 2.0, y: 2.66, w: 4.1, h: 0.4, fontSize: 12.5, color: MUTED, fontFace: FONT });
  s.addText([
    { text: '独立窗口,无地址栏与标签页', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: '任务栏独立图标,更像原生软件', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: '窗口大小 / 位置自动记忆', options: { bullet: true } },
  ], { x: 1.0, y: 3.35, w: 5.0, h: 1.7, fontSize: 13, color: TEXT, fontFace: FONT, valign: 'top' });
  // 右卡
  card(s, 6.85, 1.7, 5.85, 3.6);
  iconCircle(s, 7.25, 2.1, 0.8, '🌐');
  s.addText('DEEPHARNESS(浏览器)', { x: 8.25, y: 2.15, w: 4.1, h: 0.5, fontSize: 19, bold: true, color: TEXT, fontFace: FONT });
  s.addText('默认浏览器回退入口', { x: 8.25, y: 2.66, w: 4.1, h: 0.4, fontSize: 12.5, color: MUTED, fontFace: FONT });
  s.addText([
    { text: '在火狐 / Chrome / Edge 标签页中打开', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: '适合多标签协作、远程访问场景', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: '与原生窗口共用同一个服务与数据', options: { bullet: true } },
  ], { x: 7.25, y: 3.35, w: 5.0, h: 1.7, fontSize: 13, color: TEXT, fontFace: FONT, valign: 'top' });
  s.addText('💡 两个入口并存,按场景自由切换;共同的服务、共同的数据', {
    x: 0.6, y: 5.6, w: 12.13, h: 0.5, fontSize: 14, bold: true, color: PRIMARY, fontFace: FONT, align: 'center',
  });
  footer(s, true);
}

// ================= 9. 快速开始 =================
{
  const s = newSlide(LIGHT);
  pageTitle(s, '07', '三步完成安装');
  const steps = [
    ['1', '获取项目', 'git clone https://github.com/NANTI34/DEEPHARNESS.git'],
    ['2', '一键安装', 'powershell -ExecutionPolicy Bypass -File .\\install.ps1'],
    ['3', '双击即用', '桌面 DEEPHARNESS 快捷方式,自动完成启动与打开'],
  ];
  steps.forEach((st, i) => {
    const y = 1.65 + i * 1.5;
    card(s, 0.6, y, 8.3, 1.3);
    s.addShape('ellipse', { x: 0.95, y: y + 0.3, w: 0.7, h: 0.7, fill: { color: PRIMARY }, line: { type: 'none' } });
    s.addText(st[0], { x: 0.95, y: y + 0.3, w: 0.7, h: 0.7, fontSize: 20, bold: true, color: WHITE, fontFace: FONT, align: 'center', valign: 'middle' });
    s.addText(st[1], { x: 1.95, y: y + 0.18, w: 2.2, h: 0.45, fontSize: 16, bold: true, color: TEXT, fontFace: FONT });
    s.addText(st[2], { x: 1.95, y: y + 0.68, w: 6.7, h: 0.42, fontSize: 12, color: MUTED, fontFace: MONO, valign: 'middle' });
    if (i < 2) s.addShape('downArrow', { x: 4.52, y: y + 1.3, w: 0.32, h: 0.2, fill: { color: 'C7D4FF' }, line: { type: 'none' } });
  });
  // 右侧环境要求
  card(s, 9.2, 1.65, 3.5, 4.5);
  s.addText('环境要求', { x: 9.55, y: 1.95, w: 2.8, h: 0.5, fontSize: 18, bold: true, color: PRIMARY, fontFace: FONT });
  s.addText([
    { text: 'Windows 10 / 11 (x64)', options: { bullet: true, breakLine: true, paraSpaceAfter: 10 } },
    { text: 'Node.js 20+', options: { bullet: true, breakLine: true, paraSpaceAfter: 10 } },
    { text: '浏览器仅回退入口需要(主入口无需)', options: { bullet: true, breakLine: true, paraSpaceAfter: 10 } },
    { text: '首次安装需联网(npm 下载依赖)', options: { bullet: true } },
  ], { x: 9.55, y: 2.6, w: 2.85, h: 3.1, fontSize: 12, color: TEXT, fontFace: FONT, valign: 'top' });
  footer(s, true);
}

// ================= 10. 使用指南 =================
{
  const s = newSlide(LIGHT);
  pageTitle(s, '08', '日常使用指南');
  const blocks = [
    ['🔧', '自定义端口', 'powershell -ExecutionPolicy Bypass -File .\\launcher\\DEEPHARNESS.ps1 -Port 8080'],
    ['📂', '指定工作目录', 'powershell -ExecutionPolicy Bypass -File .\\launcher\\DEEPHARNESS.ps1 -Workspace D:\\my-workspace'],
    ['📋', '查看日志', 'logs\\server.log(运行日志) · logs\\server.err.log(错误日志)'],
    ['🩹', '故障处理', '启动失败自动弹窗展示错误尾部;端口冲突时换 -Port'],
  ];
  blocks.forEach((b, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.6 + col * 6.2, y = 1.7 + row * 2.5;
    card(s, x, y, 5.9, 2.2);
    iconCircle(s, x + 0.35, y + 0.35, 0.72, b[0]);
    s.addText(b[1], { x: x + 1.3, y: y + 0.4, w: 4.3, h: 0.5, fontSize: 17, bold: true, color: TEXT, fontFace: FONT });
    s.addShape('roundRect', { x: x + 0.35, y: y + 1.05, w: 5.2, h: 0.85, rectRadius: 0.08, fill: { color: '0F172A' }, line: { type: 'none' } });
    s.addText(b[2], { x: x + 0.6, y: y + 1.05, w: 4.75, h: 0.85, fontSize: 10.5, color: 'A5B4FC', fontFace: MONO, valign: 'middle', breakLine: true });
  });
  footer(s, true);
}

// ================= 11. 数据与安全 =================
{
  const s = newSlide(INK);
  s.addShape('ellipse', { x: -1.8, y: -1.8, w: 5, h: 5, fill: { color: '4D6BFE', transparency: 82 }, line: { type: 'none' } });
  s.addText('数据与安全', { x: 0.6, y: 0.5, w: 8, h: 0.55, fontSize: 24, bold: true, color: 'A5B4FC', fontFace: FONT, charSpacing: 3 });
  const rows = [
    ['💾', '数据 100% 本地', '配置、会话、技能、沙箱文件全部保存在 %USERPROFILE%\\.dsh,不上传任何服务器'],
    ['🔒', '仅本机可访问', '服务默认只绑定 127.0.0.1 回环地址,不对局域网 / 公网开放'],
    ['🗑️', '删除即走', '卸载应用不影响数据;彻底清除只需删除 .dsh 目录'],
    ['🔐', '凭据本地托管', '模型 API 凭据保存在本地配置中,由 DSH 自行管理'],
  ];
  rows.forEach((r, i) => {
    const y = 1.55 + i * 1.35;
    card(s, 0.6, y, 12.13, 1.15, '1B2545');
    iconCircle(s, 0.95, y + 0.23, 0.7, r[0]);
    s.addText(r[1], { x: 1.9, y: y + 0.18, w: 3.2, h: 0.45, fontSize: 16, bold: true, color: WHITE, fontFace: FONT });
    s.addText(r[2], { x: 1.9, y: y + 0.62, w: 10.3, h: 0.38, fontSize: 11.5, color: '94A3B8', fontFace: FONT });
  });
  footer(s, false);
}

// ================= 12. 开源与合规 =================
{
  const s = newSlide(LIGHT);
  pageTitle(s, '09', '开源与合规');
  // 左: 协议
  card(s, 0.6, 1.7, 5.85, 3.1);
  iconCircle(s, 1.0, 2.1, 0.8, '⚖️');
  s.addText('MIT License', { x: 2.0, y: 2.15, w: 4.1, h: 0.5, fontSize: 20, bold: true, color: TEXT, fontFace: FONT });
  s.addText([
    { text: '商用 / 修改 / 分发 / 私人使用均免费', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: '仅需保留版权声明与许可文本', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: '完整文本见仓库 LICENSE 文件', options: { bullet: true } },
  ], { x: 1.0, y: 3.15, w: 5.0, h: 1.5, fontSize: 13, color: TEXT, fontFace: FONT, valign: 'top' });
  // 右: 上游致谢
  card(s, 6.85, 1.7, 5.85, 3.1);
  iconCircle(s, 7.25, 2.1, 0.8, '🙏');
  s.addText('致谢 DeepSeek 官方', { x: 8.25, y: 2.15, w: 4.1, h: 0.5, fontSize: 20, bold: true, color: TEXT, fontFace: FONT });
  s.addText([
    { text: '上游项目: deepseek-ai/deepseek-harness', options: { breakLine: true, paraSpaceAfter: 6 } },
    { text: '应用本体: @deepseek-ai/dsh v0.1.0-rc.6 (MIT)', options: { breakLine: true, paraSpaceAfter: 6 } },
    { text: '本仓库: github.com/NANTI34/DEEPHARNESS', options: { breakLine: true, paraSpaceAfter: 6 } },
    { text: '感谢开源社区与每一位使用者', options: {} },
  ], { x: 7.25, y: 3.15, w: 5.0, h: 1.5, fontSize: 12.5, color: TEXT, fontFace: FONT, valign: 'top' });
  s.addText('✅ 本项目仅做 Windows 桌面化封装,不修改 DSH 本体逻辑,不收集任何数据', {
    x: 0.6, y: 5.15, w: 12.13, h: 0.5, fontSize: 13.5, bold: true, color: GREEN, fontFace: FONT, align: 'center',
  });
  footer(s, true);
}

// ================= 13. 未来规划 =================
{
  const s = newSlide(LIGHT);
  pageTitle(s, '10', '未来规划(Roadmap)');
  const plans = [
    ['近期', '📦', PRIMARY, '打包为独立安装程序(NSIS / Inno Setup),免 Node.js 依赖'],
    ['中期', '🪟', VIOLET, '开机自启 + 系统托盘图标,一键启停与状态提示'],
    ['远期', '🔄', NAVY, '自动更新机制 · 多语言文档 · Windows 商店分发'],
  ];
  plans.forEach((pl, i) => {
    const x = 0.6 + i * 4.15;
    card(s, x, 1.8, 3.85, 3.6);
    s.addShape('roundRect', { x: x + 0.35, y: 2.15, w: 1.15, h: 0.5, rectRadius: 0.25, fill: { color: pl[2] }, line: { type: 'none' } });
    s.addText(pl[0], { x: x + 0.35, y: 2.15, w: 1.15, h: 0.5, fontSize: 13, bold: true, color: WHITE, fontFace: FONT, align: 'center', valign: 'middle' });
    s.addText(pl[1], { x: x + 0.35, y: 2.95, w: 3.2, h: 0.9, fontSize: 52, fontFace: 'Segoe UI Emoji' });
    s.addText(pl[3], { x: x + 0.35, y: 4.05, w: 3.2, h: 1.2, fontSize: 13, color: TEXT, fontFace: FONT, valign: 'top' });
  });
  s.addText('欢迎提交 Issue / PR,一起把 DEEPHARNESS 做得更好', {
    x: 0.6, y: 5.85, w: 12.13, h: 0.5, fontSize: 14, bold: true, color: PRIMARY, fontFace: FONT, align: 'center',
  });
  footer(s, true);
}

// ================= 13b. 工作台增强(常驻插件) =================
{
  const s = newSlide(LIGHT);
  pageTitle(s, '11', '工作台增强(常驻插件)');
  const feats = [
    ['💰', '费用统计', '按 DeepSeek 官方定价实时估算会话费用,自动适配 8.17 峰谷定价(高峰/空闲)'],
    ['🎨', '外观定制', '顶栏固定品牌色 · 字体风格切换 · 渐变背景预设 · 本地字体导入'],
    ['📁', '文件视图', '工作区文件树,层级连线清晰;点击即看,就地编辑保存'],
    ['💻', '终端面板', '内置命令执行器,工作区根目录下快速运行命令'],
  ];
  feats.forEach((f, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.6 + col * 6.2, y = 1.7 + row * 2.5;
    card(s, x, y, 5.9, 2.2);
    iconCircle(s, x + 0.35, y + 0.35, 0.85, f[0]);
    s.addText(f[1], { x: x + 1.45, y: y + 0.42, w: 4.1, h: 0.55, fontSize: 18, bold: true, color: TEXT, fontFace: FONT });
    s.addText(f[2], { x: x + 0.4, y: y + 1.3, w: 5.15, h: 0.75, fontSize: 12, color: MUTED, fontFace: FONT, valign: 'top' });
  });
  s.addText('install.ps1 自动安装为常驻插件,随服务启动自动加载 — 重启不丢,无需再次授权', {
    x: 0.6, y: 6.75, w: 12.13, h: 0.4, fontSize: 12, bold: true, color: PRIMARY, fontFace: FONT, align: 'center',
  });
  footer(s, true);
}

// ================= 14. 结尾(深色) =================
{
  const s = newSlide(INK);
  s.addShape('ellipse', { x: 9.2, y: -2.0, w: 6.5, h: 6.5, fill: { color: '7C3AED', transparency: 85 }, line: { type: 'none' } });
  s.addShape('ellipse', { x: -2.2, y: 4.8, w: 6, h: 6, fill: { color: '4D6BFE', transparency: 80 }, line: { type: 'none' } });
  s.addImage({ path: path.join(__dirname, '..', '..', 'tools', 'logo.png'), x: 5.67, y: 1.35, w: 2.0, h: 2.0 });
  s.addText('谢谢观看', { x: 1.5, y: 3.55, w: 10.33, h: 0.9, fontSize: 44, bold: true, color: WHITE, fontFace: FONT, align: 'center' });
  s.addText('DEEPHARNESS · DeepSeek Harness Windows 桌面版', {
    x: 1.5, y: 4.6, w: 10.33, h: 0.5, fontSize: 16, color: 'A5B4FC', fontFace: FONT, align: 'center',
  });
  s.addText('https://github.com/NANTI34/DEEPHARNESS', {
    x: 1.5, y: 5.35, w: 10.33, h: 0.5, fontSize: 15, bold: true, color: '7C9BFF', fontFace: MONO, align: 'center',
  });
  s.addText('MIT License · 欢迎 Star ⭐ 与反馈', {
    x: 1.5, y: 6.3, w: 10.33, h: 0.4, fontSize: 12, color: '64748B', fontFace: FONT, align: 'center',
  });
}

// ---------- 输出 ----------
const outDir = path.join(__dirname, '..');
require('fs').mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'DEEPHARNESS-介绍.pptx');
p.writeFile({ fileName: outFile }).then(() => {
  console.log('PPT generated:', outFile, '(' + pageNo + ' slides)');
}).catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});
