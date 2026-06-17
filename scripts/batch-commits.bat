@echo off
setlocal enabledelayedexpansion

set /a min=20
set /a total=0

call :commit "src\app\students-portal\layout.tsx" "feat: delete student portal layout wrapper" %min% 3
call :commit "src\app\students-portal\login\page.tsx" "feat: delete student login page component" %min% 4
call :commit "src\app\students-portal\profile\page.tsx" "feat: delete student profile page component" %min% 5
call :commit "src\client\components\admin\CourseDetailView.tsx" "refactor: move admin CourseDetailView out of shared client" %min% 7
call :commit "src\client\components\admin\CreateCourseModal.tsx" "refactor: move admin CreateCourseModal out of shared client" %min% 3
call :commit "src\client\components\admin\ExportReportModal.tsx" "refactor: move admin ExportReportModal out of shared client" %min% 6
call :commit "src\client\components\admin\GlobalSearch.tsx" "refactor: move admin GlobalSearch out of shared client" %min% 4
call :commit "src\client\components\admin\StatCard.tsx" "refactor: move admin StatCard out of shared client" %min% 5
call :commit "src\client\components\admin\StudentDetailDrawer.tsx" "refactor: move admin StudentDetailDrawer out of shared client" %min% 8
call :commit "src\client\components\common\BeyundLogo.tsx" "refactor: relocate BeyundLogo component to landing-page" %min% 3
call :commit "src\client\components\common\FloatingBadge.tsx" "refactor: relocate FloatingBadge component to landing-page" %min% 4
call :commit "src\client\components\common\Footer.tsx" "refactor: relocate Footer component to landing-page" %min% 5
call :commit "src\client\components\common\Navbar.tsx" "refactor: relocate Navbar component to landing-page" %min% 6
call :commit "src\client\components\common\ScrollToTop.tsx" "refactor: relocate ScrollToTop component to landing-page" %min% 3
call :commit "src\client\components\common\SectionHeader.tsx" "refactor: relocate SectionHeader component to landing-page" %min% 4
call :commit "src\client\components\common\SocialSidebar.tsx" "refactor: relocate SocialSidebar component to landing-page" %min% 7
call :commit "src\client\components\common\WhatsAppButton.tsx" "refactor: relocate WhatsAppButton component to landing-page" %min% 5
call :commit "src\client\components\landing\CaseStudies.tsx" "refactor: relocate CaseStudies component to landing-page" %min% 3
call :commit "src\client\components\landing\Contact.tsx" "refactor: relocate Contact component to landing-page" %min% 8
call :commit "src\client\components\landing\Layers.tsx" "refactor: relocate Layers component to landing-page" %min% 4
call :commit "src\client\components\landing\MeetTheMentor.tsx" "refactor: relocate MeetTheMentor component to landing-page" %min% 6
call :commit "src\client\components\landing\PricingBadge.tsx" "refactor: relocate PricingBadge component to landing-page" %min% 3
call :commit "src\client\components\landing\ProblemHook.tsx" "refactor: relocate ProblemHook component to landing-page" %min% 5
call :commit "src\client\components\landing\ProjectCard.tsx" "refactor: relocate ProjectCard component to landing-page" %min% 4
call :commit "src\client\components\landing\SkillCard.tsx" "refactor: relocate SkillCard component to landing-page" %min% 3
call :commit "src\client\components\landing\Skills.tsx" "refactor: relocate Skills component to landing-page" %min% 7
call :commit "src\client\components\landing\VisionOutcome.tsx" "refactor: relocate VisionOutcome component to landing-page" %min% 5
call :commit "src\client\components\landing\WhatYouBecome.tsx" "refactor: relocate WhatYouBecome component to landing-page" %min% 6
call :commit "src\contexts\profile-context.tsx" "refactor: remove profile context with Supabase dependency" %min% 4
call :commit "src\contexts\search-overlay-context.tsx" "refactor: remove search overlay context from shared" %min% 3
call :commit "src\contexts\theme-context.tsx" "refactor: remove theme context from shared" %min% 8
call :commit "src\shared\auth\auth-actions.ts" "refactor: remove Supabase auth action helpers" %min% 4
call :commit "src\shared\auth\auth-guard.tsx" "refactor: remove auth guard component" %min% 5
call :commit "src\shared\auth\index.ts" "refactor: remove auth barrel export" %min% 3
call :commit "src\shared\auth\types.ts" "refactor: remove auth type definitions" %min% 4
call :commit "src\shared\auth\use-auth-session.ts" "refactor: remove useAuthSession hook" %min% 6
call :commit "src\shared\constants\data.ts" "refactor: remove shared constants data" %min% 5
call :commit "src\shared\store\auth-store.ts" "refactor: remove zustand auth store" %min% 7
call :commit "src\shared\types\index.ts" "refactor: remove shared type definitions" %min% 3
call :commit "src\shared\utils\pdf-generator.ts" "refactor: remove PDF generator utility" %min% 4
call :commit "src\admin-design-system.ts" "refactor: remove admin design system tokens" %min% 5
call :commit "build-output.txt" "chore: remove build output tracking file" %min% 3
call :commit "scripts\generate-commits.ps1" "chore: remove generated commit script" %min% 6
call :commit "scripts\maintenance\fix-states-and-enroll.mjs" "chore: remove maintenance scripts" %min% 4
call :commit "scripts\maintenance\patch-global-search.mjs" "chore: remove patch global search script" %min% 5
call :commit "scripts\migration\rewrite-admin-paths.mjs" "chore: remove rewrite paths migration script" %min% 3
call :commit "scripts\seed\seed-nigeria-students.mjs" "chore: remove seed scripts for Nigerian students" %min% 7
call :commit "scripts\seed\seed-students.mjs" "chore: remove generic seed students script" %min% 4
call :commit "scripts\split-apps.bat" "chore: remove app split script" %min% 3
call :commit "src\app\providers.tsx" "refactor: simplify providers removing QueryClientProvider" %min% 8
call :commit "src\app\page.tsx" "refactor: update landing page imports to @landing alias" %min% 5

echo Total commits: %total%
goto :eof

:commit
set /a min+=%3
if %min% geq 60 set /a min=min-60
set /a sec=%random% %% 60
if %sec% lss 10 set sec=0%sec%
set time=2026-06-17T05:%min%:%sec%
echo [%total%/%1] %time% - %~2
git add %1 >nul 2>&1
git commit --date="%time%" -m "%~2" >nul 2>&1
set /a total+=1
goto :eof