@echo off  
  
:start  
::�������̣��л�Ŀ¼  
set pwd=%cd%  
cd %1  
echo ����Ŀ¼�ǣ�& chdir    
  
:clean  
::��������̣�ִ��������  
@echo on  
@for /d /r %%c in (.svn) do @if exist %%c ( rd /s /q "%%c" & echo     ɾ��Ŀ¼%%c)  
@echo off  
echo "��ǰĿ¼�µ�svn��Ϣ�����"  
goto end  
  
:end  
::�˳�����  
cd "%pwd%"  
pause  
 