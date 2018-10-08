@echo off  
  
:start  
::启动过程，切换目录  
set pwd=%cd%  
cd %1  
echo 工作目录是：& chdir    
  
:clean  
::主处理过程，执行清理工作  
@echo on  
@for /d /r %%c in (.svn) do @if exist %%c ( rd /s /q "%%c" & echo     删除目录%%c)  
@echo off  
echo "当前目录下的svn信息已清除"  
goto end  
  
:end  
::退出程序  
cd "%pwd%"  
pause  
 