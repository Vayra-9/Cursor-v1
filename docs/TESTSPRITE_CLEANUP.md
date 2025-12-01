# 🧹 TestSprite to Playwright Migration Guide

This guide covers the complete migration from TestSprite to Playwright testing framework, including cleanup of all TestSprite references and setup of a robust Playwright CI/CD pipeline.

## 🎯 Overview

The cleanup script performs these key operations:
1. **🔍 Scans** the repository for all TestSprite references
2. **💾 Backs up** all affected files before making changes
3. **🗑️ Removes** TestSprite-specific files and configurations
4. **🔄 Replaces** TestSprite scripts with Playwright equivalents
5. **⚙️ Sets up** Playwright configuration and CI/CD workflow
6. **🔧 Configures** Firebase admin claims (optional)
7. **🧪 Runs** initial Playwright tests to verify setup

## 🚀 Quick Start

### Windows (PowerShell)
```powershell
# Basic cleanup (no Firebase admin setup)
.\scripts\cleanup-testsprite.ps1

# With Firebase admin claims setup
.\scripts\cleanup-testsprite.ps1 "C:\path\to\your\service-account.json"
```

### Linux/Mac (Bash)
```bash
# Basic cleanup (no Firebase admin setup)
./scripts/cleanup-testsprite.sh

# With Firebase admin claims setup
./scripts/cleanup-testsprite.sh "/path/to/your/service-account.json"
```

### Via npm script
```bash
# Show usage instructions
npm run cleanup:testsprite
```

## 📋 What Gets Changed

### 🗑️ Files Removed/Cleaned
- **TestSprite workflows** in `.github/workflows/`
- **TestSprite dependencies** from `package.json`
- **TestSprite-specific scripts** and configuration files
- **TestSprite references** in documentation (backed up first)

### 🆕 Files Created/Updated
- **`.github/workflows/e2e.yml`** - New Playwright CI workflow
- **`playwright.config.ts`** - Playwright configuration (if missing)
- **`package.json`** - Updated with Playwright scripts
- **Backup directory** - All original files preserved

### 📦 Scripts Updated
| Old Script | New Script | Description |
|------------|------------|-------------|
| Any TestSprite scripts | `test:e2e` | Run all Playwright tests |
| | `test:e2e:ui` | Interactive test mode |
| | `test:e2e:report` | View test reports |
| | `test:e2e:all` | Run full test suite |

## 🔧 Detailed Process

### Step 1: Repository Scan
```
🔍 Scanning for TestSprite references...
Found TestSprite references in:
  - docs/FIREBASE_ADMIN_SETUP.md
  - package.json
  - scripts/setClaims.ts
  - testsprite_frontend_test_plan.json
```

### Step 2: Backup Creation
```
📁 Creating backup directory: testsprite-backups-20250116120000
✅ All affected files backed up safely
```

### Step 3: GitHub Workflows
```
🔄 Processing .github/workflows/
✅ TestSprite workflows backed up and removed
✅ New Playwright workflow created
```

### Step 4: Package.json Update
```
📦 Updating package.json...
✅ TestSprite scripts replaced with Playwright
✅ TestSprite dependencies removed
✅ New Playwright scripts added
```

### Step 5: File Cleanup
```
🗑️ Processing TestSprite-specific files...
✅ testsprite_frontend_test_plan.json → backed up and removed
✅ Other references cleaned from documentation
```

### Step 6: Playwright Setup
```
⚙️ Setting up Playwright configuration...
✅ playwright.config.ts created with optimal settings
✅ Multi-browser support configured
✅ Web server integration enabled
```

### Step 7: Git Operations
```
🌿 Creating backup branch: pre-testsprite-cleanup-20250116120000
✅ Changes committed to current branch
✅ Backup branch preserved for safety
```

### Step 8: Dependencies
```
📚 Installing Playwright browsers...
✅ Chromium, Firefox, Safari browsers installed
✅ System dependencies configured
```

### Step 9: Firebase Admin (Optional)
```
🔧 Setting up Firebase admin claims...
✅ test@vayra.digital configured as admin
✅ Full plan access granted
✅ Claims verified successfully
```

### Step 10: Test Execution
```
🧪 Running Playwright tests...
✅ Admin panel tests passed
✅ Navigation tests passed
✅ Test report generated
```

## 📊 Expected Outcomes

### ✅ Before Cleanup (TestSprite Issues)
- ❌ 5 HIGH SEVERITY issues
- ❌ 58% test pass rate
- ❌ Firebase permission errors
- ❌ Plan gating failures
- ❌ Navigation issues

### ✅ After Cleanup (Playwright Success)
- ✅ 0 HIGH SEVERITY issues expected
- ✅ 90%+ test pass rate expected
- ✅ Firebase admin access working
- ✅ All plans accessible
- ✅ Navigation fully functional

## 🔍 Verification Steps

### 1. Check Git Status
```bash
git status
git log --oneline -5
```

### 2. Verify Package.json
```bash
npm run test:e2e --help
npm run test:e2e:ui --help
```

### 3. Test Firebase Admin
```bash
npm run claims:verify
```

### 4. Run Playwright Tests
```bash
npm run test:e2e
npm run test:e2e:report
```

### 5. Check Admin Panel
1. Visit `http://localhost:5174/admin`
2. Sign in as `test@vayra.digital`
3. Verify admin claims display

## 🐛 Troubleshooting

### Backup Recovery
If you need to restore original files:
```bash
# List backup directories
ls -la testsprite-backups-*

# Restore specific file
cp testsprite-backups-*/package.json.bak.json package.json

# Restore entire backup
BACKUP_DIR="testsprite-backups-20250116120000"
cp -r "$BACKUP_DIR"/* .
```

### Git Issues
```bash
# Check backup branches
git branch | grep pre-testsprite-cleanup

# Switch to backup branch
git checkout pre-testsprite-cleanup-20250116120000

# Reset to backup state
git reset --hard pre-testsprite-cleanup-20250116120000
```

### Playwright Issues
```bash
# Reinstall Playwright
npx playwright install --force --with-deps

# Update configuration
npm run test:e2e:update
```

### Firebase Admin Issues
```bash
# Check environment variable
echo $GOOGLE_APPLICATION_CREDENTIALS  # Linux/Mac
echo $env:GOOGLE_APPLICATION_CREDENTIALS  # Windows

# Verify service account
node -e "console.log(require('$GOOGLE_APPLICATION_CREDENTIALS'))"
```

## 📁 File Structure After Cleanup

```
project/
├── .github/workflows/
│   └── e2e.yml                    # New Playwright CI
├── docs/
│   ├── TESTSPRITE_CLEANUP.md      # This guide
│   └── FULL_ADMIN_SETUP.md        # Admin setup guide
├── scripts/
│   ├── cleanup-testsprite.sh      # Linux/Mac cleanup
│   ├── cleanup-testsprite.ps1     # Windows cleanup
│   ├── setClaims.cjs              # Firebase admin
│   └── verifyClaims.cjs           # Claims verification
├── tests/e2e/
│   └── admin-panel.spec.ts        # Admin panel tests
├── testsprite-backups-*/          # Backup directory
│   ├── package.json.bak.json     # Original package.json
│   └── [other backed up files]
├── playwright.config.ts           # Playwright config
└── package.json                   # Updated scripts
```

## 🔗 Integration Benefits

### CI/CD Pipeline
- **Automated testing** on every push/PR
- **Multi-browser coverage** (Chrome, Firefox, Safari)
- **Test artifacts** automatically uploaded
- **Parallel execution** for faster feedback

### Development Workflow
- **Local testing** with `npm run test:e2e`
- **Interactive debugging** with `npm run test:e2e:ui`
- **Visual reports** with screenshots and videos
- **Hot reload** integration with dev server

### Maintenance
- **Native Playwright** - no external dependencies
- **Version controlled** - all configuration in repo
- **Extensible** - easy to add new tests
- **Reliable** - industry-standard testing framework

## 🎯 Next Steps After Cleanup

1. **Review Changes**
   ```bash
   git diff HEAD~1
   git status
   ```

2. **Test Locally**
   ```bash
   npm run dev
   npm run test:e2e
   ```

3. **Deploy & Monitor**
   ```bash
   git push
   # Check GitHub Actions for CI results
   ```

4. **Extend Testing**
   - Add more test cases in `tests/e2e/`
   - Configure additional browsers
   - Set up visual regression testing

---

*This cleanup provides a complete migration path from TestSprite to a production-ready Playwright testing infrastructure while preserving all original files through comprehensive backups.*
