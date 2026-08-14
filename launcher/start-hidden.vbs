' DEEPHARNESS 无控制台窗口启动器
' 由桌面快捷方式调用:隐藏 PowerShell 窗口后执行 DEEPHARNESS.ps1
Option Explicit
Dim fso, root, shell, ps
Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")
root = fso.GetParentFolderName(fso.GetParentFolderName(WScript.ScriptFullName))
ps = """" & root & "\launcher\DEEPHARNESS.ps1"""
shell.Run "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File " & ps, 0, False
