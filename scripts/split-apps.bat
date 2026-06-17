@echo off
set ORIG=c:\Users\PC\Downloads\beyund_landing_page
set LANDING=c:\Users\PC\Downloads\beyund-landing
set ADMIN=c:\Users\PC\Downloads\beyund-admin
set STUDENT=c:\Users\PC\Downloads\beyund-student

echo === Copying LANDING PAGE files ===
xcopy "%ORIG%\src\app\layout.tsx" "%LANDING%\src\app\" /Y /Q
xcopy "%ORIG%\src\app\page.tsx" "%LANDING%\src\app\" /Y /Q
xcopy "%ORIG%\src\app\providers.tsx" "%LANDING%\src\app\" /Y /Q
xcopy "%ORIG%\src\app\globals.css" "%LANDING%\src\app\" /Y /Q
xcopy "%ORIG%\src\client\components\landing" "%LANDING%\src\client\components\landing\" /E /I /Y /Q
xcopy "%ORIG%\src\client\components\common" "%LANDING%\src\client\components\common\" /E /I /Y /Q
xcopy "%ORIG%\src\config\theme-colors.ts" "%LANDING%\src\config\" /Y /Q
xcopy "%ORIG%\src\contexts\theme-context.tsx" "%LANDING%\src\contexts\" /Y /Q
xcopy "%ORIG%\public" "%LANDING%\public\" /E /I /Y /Q

echo === Copying ADMIN files ===
xcopy "%ORIG%\src\app\admin" "%ADMIN%\src\app\admin\" /E /I /Y /Q
xcopy "%ORIG%\src\app\api\admin" "%ADMIN%\src\app\api\admin\" /E /I /Y /Q
xcopy "%ORIG%\src\app\api\check-email" "%ADMIN%\src\app\api\check-email\" /E /I /Y /Q
xcopy "%ORIG%\src\app\api\verify-email" "%ADMIN%\src\app\api\verify-email\" /E /I /Y /Q
xcopy "%ORIG%\src\client\components\admin" "%ADMIN%\src\client\components\admin\" /E /I /Y /Q
xcopy "%ORIG%\src\client\components\common" "%ADMIN%\src\client\components\common\" /E /I /Y /Q
xcopy "%ORIG%\src\config" "%ADMIN%\src\config\" /E /I /Y /Q
xcopy "%ORIG%\src\contexts" "%ADMIN%\src\contexts\" /E /I /Y /Q
xcopy "%ORIG%\src\server" "%ADMIN%\src\server\" /E /I /Y /Q
xcopy "%ORIG%\src\shared" "%ADMIN%\src\shared\" /E /I /Y /Q
xcopy "%ORIG%\src\app\globals.css" "%ADMIN%\src\app\" /Y /Q
xcopy "%ORIG%\public" "%ADMIN%\public\" /E /I /Y /Q

echo === Copying STUDENT PORTAL files ===
xcopy "%ORIG%\src\app\students-portal" "%STUDENT%\src\app\students-portal\" /E /I /Y /Q
xcopy "%ORIG%\src\app\api\students-portal" "%STUDENT%\src\app\api\students-portal\" /E /I /Y /Q
xcopy "%ORIG%\src\client\components\common" "%STUDENT%\src\client\components\common\" /E /I /Y /Q
xcopy "%ORIG%\src\config\theme-colors.ts" "%STUDENT%\src\config\" /Y /Q
xcopy "%ORIG%\src\contexts\theme-context.tsx" "%STUDENT%\src\contexts\" /Y /Q
xcopy "%ORIG%\src\server\integration\supabase.client.ts" "%STUDENT%\src\server\integration\" /Y /Q
xcopy "%ORIG%\src\server\proxy.ts" "%STUDENT%\src\server\" /Y /Q
xcopy "%ORIG%\src\shared\auth" "%STUDENT%\src\shared\auth\" /E /I /Y /Q
xcopy "%ORIG%\src\shared\store" "%STUDENT%\src\shared\store\" /E /I /Y /Q
xcopy "%ORIG%\src\shared\types" "%STUDENT%\src\shared\types\" /E /I /Y /Q
xcopy "%ORIG%\src\shared\constants" "%STUDENT%\src\shared\constants\" /E /I /Y /Q
xcopy "%ORIG%\src\shared\utils" "%STUDENT%\src\shared\utils\" /E /I /Y /Q
xcopy "%ORIG%\src\app\globals.css" "%STUDENT%\src\app\" /Y /Q
xcopy "%ORIG%\public" "%STUDENT%\public\" /E /I /Y /Q

echo === ALL DONE ===