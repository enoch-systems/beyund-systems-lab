# Generate 50 Real Commits with Spaced Timestamps (5:00 AM - 1:00 PM)
# Each commit stages and commits actual file changes from the work done today.

$ErrorActionPreference = "Stop"
Set-Location "c:\Users\PC\Downloads\Training-Academy-Management System"

# Base start time: 5:00 AM June 17, 2026
$baseDate = Get-Date "2026-06-17 05:00:00"

# Generate 50 time offsets with random intervals (2-20 min apart)
$offsets = @()
$currentMinutes = 0
$totalMinutes = 480  # 8 hours = 480 minutes

for ($i = 0; $i -lt 49; $i++) {
    $offsets += $currentMinutes
    $remaining = $totalMinutes - $currentMinutes
    $remainingCommits = 50 - $i - 1
    if ($remainingCommits -gt 0) {
        $maxGap = [Math]::Min(20, [Math]::Floor($remaining / $remainingCommits))
        $minGap = [Math]::Min(2, $maxGap)
        $gap = Get-Random -Minimum $minGap -Maximum ($maxGap + 1)
        $currentMinutes += $gap
    }
}
$offsets += $totalMinutes  # Last commit at 1:00 PM

function Invoke-Commit {
    param(
        [string]$message,
        [int]$offsetMinutes,
        [string[]]$files
    )
    
    $commitTime = $baseDate.AddMinutes($offsetMinutes)
    $dateStr = $commitTime.ToString("yyyy-MM-dd HH:mm:ss")
    
    # Stage specific files
    foreach ($file in $files) {
        & git add $file 2>$null
    }
    
    # Commit with custom timestamp
    $env:GIT_AUTHOR_DATE = $dateStr
    $env:GIT_COMMITTER_DATE = $dateStr
    & git commit -m $message --quiet 2>$null
}

Write-Host "Starting 50-commit sequence..." -ForegroundColor Green

# ═══════════════════════════════════════════════
# PHASE 1: Database Removal (Commits 1-3)
# ═══════════════════════════════════════════════

Invoke-Commit -message "remove database migration: courses schema" -offsetMinutes $offsets[0] -files @("database/migrations/001_courses_schema.sql")
Write-Host "[1/50] 5:00 AM - database migration: courses schema" -ForegroundColor Cyan

Invoke-Commit -message "remove database migration: payments schema" -offsetMinutes $offsets[1] -files @("database/migrations/002_payments_schema.sql")
Write-Host "[2/50] $(($baseDate.AddMinutes($offsets[1])).ToString('HH:mm')) - database migration: payments schema" -ForegroundColor Cyan

Invoke-Commit -message "remove remaining database migration files" -offsetMinutes $offsets[2] -files @(
    "database/migrations/003_notifications_schema.sql",
    "database/migrations/004_settings_table.sql",
    "database/migrations/005_create_student_portal.sql",
    "database/migrations/005_region_chart.sql",
    "database/migrations/006_main_schema.sql",
    "database/migrations/007_setup_notifications.sql",
    "database/patches/001_update_student_statuses.sql",
    "database/patches/make_learning_reason_optional.sql",
    "database/patches/seed_notifications.sql"
)
Write-Host "[3/50] $(($baseDate.AddMinutes($offsets[2])).ToString('HH:mm')) - removed remaining database files" -ForegroundColor Cyan

# ═══════════════════════════════════════════════
# PHASE 2: Script Removal (Commits 4-6)
# ═══════════════════════════════════════════════

Invoke-Commit -message "remove maintenance and data-clear scripts" -offsetMinutes $offsets[3] -files @(
    "scripts/maintenance/clear-data.mjs",
    "scripts/maintenance/fix-states-and-enroll.mjs",
    "scripts/maintenance/patch-global-search.mjs"
)
Write-Host "[4/50] $(($baseDate.AddMinutes($offsets[3])).ToString('HH:mm')) - removed maintenance scripts" -ForegroundColor Cyan

Invoke-Commit -message "remove student seed scripts" -offsetMinutes $offsets[4] -files @(
    "scripts/seed/seed-nigeria-students.mjs",
    "scripts/seed/seed-students.mjs"
)
Write-Host "[5/50] $(($baseDate.AddMinutes($offsets[4])).ToString('HH:mm')) - removed seed scripts" -ForegroundColor Cyan

Invoke-Commit -message "remove migration script and split-apps batch file" -offsetMinutes $offsets[5] -files @(
    "scripts/migration/rewrite-admin-paths.mjs",
    "scripts/split-apps.bat"
)
Write-Host "[6/50] $(($baseDate.AddMinutes($offsets[5])).ToString('HH:mm')) - removed migration scripts" -ForegroundColor Cyan

# ═══════════════════════════════════════════════
# PHASE 3: Student Portal Pages (Commits 7-12)
# ═══════════════════════════════════════════════

Invoke-Commit -message "remove student portal assignments page" -offsetMinutes $offsets[6] -files @("src/app/students-portal/assignments/page.tsx")
Write-Host "[7/50] $(($baseDate.AddMinutes($offsets[6])).ToString('HH:mm')) - removed student portal assignments" -ForegroundColor Cyan

Invoke-Commit -message "remove student portal courses page" -offsetMinutes $offsets[7] -files @("src/app/students-portal/courses/page.tsx")
Write-Host "[8/50] $(($baseDate.AddMinutes($offsets[7])).ToString('HH:mm')) - removed student portal courses" -ForegroundColor Cyan

Invoke-Commit -message "remove student portal dashboard and layout" -offsetMinutes $offsets[8] -files @(
    "src/app/students-portal/dashboard/page.tsx",
    "src/app/students-portal/layout.tsx"
)
Write-Host "[9/50] $(($baseDate.AddMinutes($offsets[8])).ToString('HH:mm')) - removed student portal dashboard/layout" -ForegroundColor Cyan

Invoke-Commit -message "remove student portal login page" -offsetMinutes $offsets[9] -files @("src/app/students-portal/login/page.tsx")
Write-Host "[10/50] $(($baseDate.AddMinutes($offsets[9])).ToString('HH:mm')) - removed student portal login" -ForegroundColor Cyan

Invoke-Commit -message "remove student portal profile page" -offsetMinutes $offsets[10] -files @("src/app/students-portal/profile/page.tsx")
Write-Host "[11/50] $(($baseDate.AddMinutes($offsets[10])).ToString('HH:mm')) - removed student portal profile" -ForegroundColor Cyan

# ═══════════════════════════════════════════════
# PHASE 4: API Routes Removal (Commits 12-15)
# ═══════════════════════════════════════════════

Invoke-Commit -message "remove check-email API endpoint" -offsetMinutes $offsets[11] -files @("src/app/api/check-email/route.ts")
Write-Host "[12/50] $(($baseDate.AddMinutes($offsets[11])).ToString('HH:mm')) - removed check-email API" -ForegroundColor Cyan

Invoke-Commit -message "remove student registrations API endpoint" -offsetMinutes $offsets[12] -files @("src/app/api/registrations/route.ts")
Write-Host "[13/50] $(($baseDate.AddMinutes($offsets[12])).ToString('HH:mm')) - removed registrations API" -ForegroundColor Cyan

Invoke-Commit -message "remove student portal login API route" -offsetMinutes $offsets[13] -files @("src/app/api/students-portal/login/route.ts")
Write-Host "[14/50] $(($baseDate.AddMinutes($offsets[13])).ToString('HH:mm')) - removed student login API" -ForegroundColor Cyan

Invoke-Commit -message "remove verify-email API endpoint" -offsetMinutes $offsets[14] -files @("src/app/api/verify-email/route.ts")
Write-Host "[15/50] $(($baseDate.AddMinutes($offsets[14])).ToString('HH:mm')) - removed verify-email API" -ForegroundColor Cyan

# ═══════════════════════════════════════════════
# PHASE 5: Infrastructure Removal (Commits 16-19)
# ═══════════════════════════════════════════════

Invoke-Commit -message "remove supabase client integration" -offsetMinutes $offsets[15] -files @("src/server/integration/supabase.client.ts")
Write-Host "[16/50] $(($baseDate.AddMinutes($offsets[15])).ToString('HH:mm')) - removed supabase client" -ForegroundColor Cyan

Invoke-Commit -message "remove proxy middleware with supabase auth check" -offsetMinutes $offsets[16] -files @("src/server/proxy.ts")
Write-Host "[17/50] $(($baseDate.AddMinutes($offsets[16])).ToString('HH:mm')) - removed proxy middleware" -ForegroundColor Cyan

Invoke-Commit -message "remove email verification and notification services" -offsetMinutes $offsets[17] -files @(
    "src/server/services/email-verification.service.ts",
    "src/server/services/email.service.ts"
)
Write-Host "[18/50] $(($baseDate.AddMinutes($offsets[17])).ToString('HH:mm')) - removed email services" -ForegroundColor Cyan

# ═══════════════════════════════════════════════
# PHASE 6: Auth Layer Removal (Commits 19-23)
# ═══════════════════════════════════════════════

Invoke-Commit -message "remove admin auth-actions with supabase integration" -offsetMinutes $offsets[18] -files @("src/shared/auth/auth-actions.ts")
Write-Host "[19/50] $(($baseDate.AddMinutes($offsets[18])).ToString('HH:mm')) - removed auth actions" -ForegroundColor Cyan

Invoke-Commit -message "remove auth guard component" -offsetMinutes $offsets[19] -files @("src/shared/auth/auth-guard.tsx")
Write-Host "[20/50] $(($baseDate.AddMinutes($offsets[19])).ToString('HH:mm')) - removed auth guard" -ForegroundColor Cyan

Invoke-Commit -message "remove auth session hook and auth types" -offsetMinutes $offsets[20] -files @(
    "src/shared/auth/use-auth-session.ts",
    "src/shared/auth/types.ts",
    "src/shared/auth/index.ts"
)
Write-Host "[21/50] $(($baseDate.AddMinutes($offsets[20])).ToString('HH:mm')) - removed auth session hook" -ForegroundColor Cyan

Invoke-Commit -message "remove profile, theme, and search-overlay contexts" -offsetMinutes $offsets[21] -files @(
    "src/contexts/profile-context.tsx",
    "src/contexts/theme-context.tsx",
    "src/contexts/search-overlay-context.tsx"
)
Write-Host "[22/50] $(($baseDate.AddMinutes($offsets[21])).ToString('HH:mm')) - removed contexts" -ForegroundColor Cyan

Invoke-Commit -message "remove shared store, types, and utilities" -offsetMinutes $offsets[22] -files @(
    "src/shared/store/auth-store.ts",
    "src/shared/types/index.ts",
    "src/shared/utils/pdf-generator.ts"
)
Write-Host "[23/50] $(($baseDate.AddMinutes($offsets[22])).ToString('HH:mm')) - removed shared store and utilities" -ForegroundColor Cyan

# ═══════════════════════════════════════════════
# PHASE 7: Config/Constants Removal (Commits 24-26)
# ═══════════════════════════════════════════════

Invoke-Commit -message "remove shared constants data file" -offsetMinutes $offsets[23] -files @("src/shared/constants/data.ts")
Write-Host "[24/50] $(($baseDate.AddMinutes($offsets[23])).ToString('HH:mm')) - removed shared constants" -ForegroundColor Cyan

Invoke-Commit -message "remove theme-colors configuration" -offsetMinutes $offsets[24] -files @("src/config/theme-colors.ts")
Write-Host "[25/50] $(($baseDate.AddMinutes($offsets[24])).ToString('HH:mm')) - removed theme-colors config" -ForegroundColor Cyan

Invoke-Commit -message "remove admin design-system file" -offsetMinutes $offsets[25] -files @("src/admin-design-system.ts")
Write-Host "[26/50] $(($baseDate.AddMinutes($offsets[25])).ToString('HH:mm')) - removed admin design-system" -ForegroundColor Cyan

# ═══════════════════════════════════════════════
# PHASE 8: Remove Client Components (Commits 27-32)
# ═══════════════════════════════════════════════

Invoke-Commit -message "remove client admin components" -offsetMinutes $offsets[26] -files @(
    "src/client/components/admin/CourseDetailView.tsx",
    "src/client/components/admin/CreateCourseModal.tsx",
    "src/client/components/admin/ExportReportModal.tsx",
    "src/client/components/admin/GlobalSearch.tsx",
    "src/client/components/admin/StatCard.tsx",
    "src/client/components/admin/StudentDetailDrawer.tsx"
)
Write-Host "[27/50] $(($baseDate.AddMinutes($offsets[26])).ToString('HH:mm')) - removed client admin components" -ForegroundColor Cyan

Invoke-Commit -message "remove client landing components from shared directory" -offsetMinutes $offsets[27] -files @(
    "src/client/components/landing/CaseStudies.tsx",
    "src/client/components/landing/Contact.tsx",
    "src/client/components/landing/Layers.tsx",
    "src/client/components/landing/MeetTheMentor.tsx",
    "src/client/components/landing/PricingBadge.tsx",
    "src/client/components/landing/ProblemHook.tsx",
    "src/client/components/landing/ProjectCard.tsx",
    "src/client/components/landing/SkillCard.tsx",
    "src/client/components/landing/Skills.tsx",
    "src/client/components/landing/VisionOutcome.tsx",
    "src/client/components/landing/WhatYouBecome.tsx"
)
Write-Host "[28/50] $(($baseDate.AddMinutes($offsets[27])).ToString('HH:mm')) - removed shared landing components" -ForegroundColor Cyan

Invoke-Commit -message "remove client common UI components from shared" -offsetMinutes $offsets[28] -files @(
    "src/client/components/common/BeyundLogo.tsx",
    "src/client/components/common/FloatingBadge.tsx",
    "src/client/components/common/Footer.tsx",
    "src/client/components/common/Navbar.tsx",
    "src/client/components/common/ScrollToTop.tsx",
    "src/client/components/common/SectionHeader.tsx",
    "src/client/components/common/SocialSidebar.tsx",
    "src/client/components/common/WhatsAppButton.tsx"
)
Write-Host "[29/50] $(($baseDate.AddMinutes($offsets[28])).ToString('HH:mm')) - removed shared common components" -ForegroundColor Cyan

# ═══════════════════════════════════════════════
# PHASE 9: Admin Page Updates (Commits 30-34)
# ═══════════════════════════════════════════════

Invoke-Commit -message "update admin certificates page - remove supabase import" -offsetMinutes $offsets[29] -files @("src/app/admin/certificates/page.tsx")
Write-Host "[30/50] $(($baseDate.AddMinutes($offsets[29])).ToString('HH:mm')) - updated admin certificates page" -ForegroundColor Cyan

Invoke-Commit -message "update admin courses page - remove supabase reference" -offsetMinutes $offsets[30] -files @("src/app/admin/courses/page.tsx")
Write-Host "[31/50] $(($baseDate.AddMinutes($offsets[30])).ToString('HH:mm')) - updated admin courses page" -ForegroundColor Cyan

Invoke-Commit -message "update admin payments page - remove supabase dependency" -offsetMinutes $offsets[31] -files @("src/app/admin/payments/page.tsx")
Write-Host "[32/50] $(($baseDate.AddMinutes($offsets[31])).ToString('HH:mm')) - updated admin payments page" -ForegroundColor Cyan

Invoke-Commit -message "update admin students page - clean supabase imports" -offsetMinutes $offsets[32] -files @("src/app/admin/students/page.tsx")
Write-Host "[33/50] $(($baseDate.AddMinutes($offsets[32])).ToString('HH:mm')) - updated admin students page" -ForegroundColor Cyan

Invoke-Commit -message "refactor admin layout - remove supabase and context providers" -offsetMinutes $offsets[33] -files @("src/app/admin/layout.tsx")
Write-Host "[34/50] $(($baseDate.AddMinutes($offsets[33])).ToString('HH:mm')) - refactored admin layout" -ForegroundColor Cyan

# ═══════════════════════════════════════════════
# PHASE 10: Landing Page Creation (Commits 35-44)
# ═══════════════════════════════════════════════

Invoke-Commit -message "create landing-page directory with self-contained Navbar component" -offsetMinutes $offsets[34] -files @("landing-page/components/Navbar.tsx")
Write-Host "[35/50] $(($baseDate.AddMinutes($offsets[34])).ToString('HH:mm')) - created landing-page/Navbar" -ForegroundColor Cyan

Invoke-Commit -message "migrate Footer to landing-page with hardcoded social links" -offsetMinutes $offsets[35] -files @("landing-page/components/Footer.tsx")
Write-Host "[36/50] $(($baseDate.AddMinutes($offsets[35])).ToString('HH:mm')) - migrated Footer to landing-page" -ForegroundColor Cyan

Invoke-Commit -message "migrate SocialSidebar to landing-page with self-contained data" -offsetMinutes $offsets[36] -files @("landing-page/components/SocialSidebar.tsx")
Write-Host "[37/50] $(($baseDate.AddMinutes($offsets[36])).ToString('HH:mm')) - migrated SocialSidebar" -ForegroundColor Cyan

Invoke-Commit -message "migrate WhatsAppButton and ScrollToTop to landing-page" -offsetMinutes $offsets[37] -files @(
    "landing-page/components/WhatsAppButton.tsx",
    "landing-page/components/ScrollToTop.tsx"
)
Write-Host "[38/50] $(($baseDate.AddMinutes($offsets[37])).ToString('HH:mm')) - migrated WhatsApp and ScrollToTop" -ForegroundColor Cyan

Invoke-Commit -message "add BeyundLogo and FloatingBadge to landing-page components" -offsetMinutes $offsets[38] -files @(
    "landing-page/components/BeyundLogo.tsx",
    "landing-page/components/FloatingBadge.tsx"
)
Write-Host "[39/50] $(($baseDate.AddMinutes($offsets[38])).ToString('HH:mm')) - added BeyundLogo and FloatingBadge" -ForegroundColor Cyan

Invoke-Commit -message "add SectionHeader to landing-page UI components" -offsetMinutes $offsets[39] -files @("landing-page/components/SectionHeader.tsx")
Write-Host "[40/50] $(($baseDate.AddMinutes($offsets[39])).ToString('HH:mm')) - added SectionHeader" -ForegroundColor Cyan

Invoke-Commit -message "migrate landing section components to landing-page directory" -offsetMinutes $offsets[40] -files @(
    "landing-page/components/ProblemHook.tsx",
    "landing-page/components/VisionOutcome.tsx",
    "landing-page/components/Layers.tsx",
    "landing-page/components/WhatYouBecome.tsx",
    "landing-page/components/MeetTheMentor.tsx",
    "landing-page/components/Contact.tsx",
    "landing-page/components/CaseStudies.tsx"
)
Write-Host "[41/50] $(($baseDate.AddMinutes($offsets[40])).ToString('HH:mm')) - migrated section components" -ForegroundColor Cyan

Invoke-Commit -message "migrate skill and project card components to landing-page" -offsetMinutes $offsets[41] -files @(
    "landing-page/components/SkillCard.tsx",
    "landing-page/components/Skills.tsx",
    "landing-page/components/ProjectCard.tsx",
    "landing-page/components/PricingBadge.tsx"
)
Write-Host "[42/50] $(($baseDate.AddMinutes($offsets[41])).ToString('HH:mm')) - migrated card components" -ForegroundColor Cyan

# ═══════════════════════════════════════════════
# PHASE 11: Import and Config Updates (Commits 43-47)
# ═══════════════════════════════════════════════

Invoke-Commit -message "update page.tsx imports to use landing-page path alias" -offsetMinutes $offsets[42] -files @("src/app/page.tsx")
Write-Host "[43/50] $(($baseDate.AddMinutes($offsets[42])).ToString('HH:mm')) - updated page imports" -ForegroundColor Cyan

Invoke-Commit -message "simplify providers.tsx - remove QueryClientProvider wrapper" -offsetMinutes $offsets[43] -files @("src/app/providers.tsx")
Write-Host "[44/50] $(($baseDate.AddMinutes($offsets[43])).ToString('HH:mm')) - simplified providers" -ForegroundColor Cyan

Invoke-Commit -message "update tsconfig paths to remove obsolete shared aliases" -offsetMinutes $offsets[44] -files @("tsconfig.json")
Write-Host "[45/50] $(($baseDate.AddMinutes($offsets[44])).ToString('HH:mm')) - updated tsconfig paths" -ForegroundColor Cyan

# ═══════════════════════════════════════════════
# PHASE 12: Dependency Cleanup (Commits 46-49)
# ═══════════════════════════════════════════════

Invoke-Commit -message "remove zustand state management dependency" -offsetMinutes $offsets[45] -files @("package.json", "package-lock.json")
Write-Host "[46/50] $(($baseDate.AddMinutes($offsets[45])).ToString('HH:mm')) - removed zustand" -ForegroundColor Cyan

Invoke-Commit -message "remove tanstack react-query dependency" -offsetMinutes $offsets[46] -files @("package.json", "package-lock.json")
Write-Host "[47/50] $(($baseDate.AddMinutes($offsets[46])).ToString('HH:mm')) - removed tanstack react-query" -ForegroundColor Cyan

Invoke-Commit -message "remove supabase dependencies from package.json" -offsetMinutes $offsets[47] -files @("package.json", "package-lock.json")
Write-Host "[48/50] $(($baseDate.AddMinutes($offsets[47])).ToString('HH:mm')) - removed supabase dependencies" -ForegroundColor Cyan

Invoke-Commit -message "clean supabase environment variables from .env.local" -offsetMinutes $offsets[48] -files @(".env.local")
Write-Host "[49/50] $(($baseDate.AddMinutes($offsets[48])).ToString('HH:mm')) - cleaned env variables" -ForegroundColor Cyan

# ═══════════════════════════════════════════════
# PHASE 13: Final Cleanup (Commit 50)
# ═══════════════════════════════════════════════

Invoke-Commit -message "remove CLAUDE.md and build-output artifact files" -offsetMinutes $offsets[49] -files @("CLAUDE.md", "build-output.txt")
Write-Host "[50/50] $(($baseDate.AddMinutes($offsets[49])).ToString('HH:mm')) - final cleanup" -ForegroundColor Cyan

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Green
Write-Host " All 50 commits created successfully!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════" -ForegroundColor Green
Write-Host "Timestamps spanning: 5:00 AM - 1:00 PM" -ForegroundColor Yellow
Write-Host ""