# TODO Issue Sync Script

This script automatically synchronizes TODO comments in the codebase with GitHub issues.

## How It Works

1. On every push to any branch, the GitHub Action scans the codebase for TODO comments
2. For each TODO comment found, it creates a corresponding GitHub issue with the prefix `[AUTO-TODO]`
3. When a TODO comment is removed from the code, the corresponding GitHub issue is automatically closed
4. FIXME comments are also processed with the prefix `[AUTO-FIXME]`

## TODO Comment Format

The script recognizes TODO comments in the following formats:
- `// TODO: description`
- `// todo: description` (lowercase)
- `// TODO(description)`
- `// FIXME: description`
- `# TODO: description` (for shell scripts/markdown)
- `/* TODO: description */` (multiline comments)
- `/* 
  * todo: description
  */` (multiline block comments)

## Features

- **Automatic Issue Creation**: New TODOs in the code automatically generate GitHub issues
- **Issue Resolution**: When TODOs are removed from code, their corresponding issues are closed
- **Clear Labeling**: Auto-created issues are prefixed with `[AUTO-TODO]` or `[AUTO-FIXME]` for easy identification
- **Traceability**: Each issue includes the file name and line number where the TODO was found
- **Non-Intrusive**: Only affects issues created by this automation
- **Case Insensitive**: Recognizes both uppercase and lowercase TODO/FIXME comments
- **Multiline Support**: Handles both single-line and multiline comment formats

## Labels

Auto-created issues receive the following labels:
- `auto-generated`: Identifies issues created by this automation
- `todo`: Categorizes the issue as a TODO task

## Configuration

The script requires the following GitHub token permissions:
- `issues: write` - To create and close issues
- `contents: read` - To read the repository contents

## Manual Testing

To test the script locally:
```bash
cd .github
npm install
GITHUB_TOKEN=your_token GITHUB_REPOSITORY=owner/repo node scripts/sync-todos.js
```