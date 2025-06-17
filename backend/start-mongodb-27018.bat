@echo off
echo 正在启动MongoDB在端口27018...
"C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "C:\data\db" --logpath "C:\data\log\mongod-27018.log" --port 27018 --logappend
pause 