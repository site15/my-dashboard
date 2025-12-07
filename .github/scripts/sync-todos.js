import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';
import fs from 'fs';

// Initialize Octokit with GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Get repository information from environment variables
const owner = process.env.GITHUB_REPOSITORY?.split('/')[0] || '';
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
const sha = process.env.GITHUB_SHA || '';

console.log(`Running TODO sync for ${owner}/${repo}`);

// Function to get all TODO comments from the codebase
function getTodos() {
  try {
    // Get all tracked files in the repository
    const files = execSync('git ls-files', { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(file => 
        file.endsWith('.ts') || 
        file.endsWith('.js') || 
        file.endsWith('.tsx') || 
        file.endsWith('.jsx') ||
        file.endsWith('.md')
      );
    
    const todos = [];
    
    // Search for TODO comments in each file
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          // Match single-line comments: // todo, /* todo, # todo, etc.
          const singleLineMatch = line.match(/(?:\/\/|#|\/\*)\s*(todo|fixme)(?:\([^)]*\))?(:.*)?/i);
          if (singleLineMatch) {
            const todoType = singleLineMatch[1].toUpperCase();
            const todoDescription = (singleLineMatch[2] || '').substring(1).trim() || 'Unspecified task';
            
            todos.push({
              file,
              line: i + 1,
              type: todoType,
              description: todoDescription,
              content: line.trim()
            });
          }
          
          // Match multiline comments: /* todo */
          const multilineMatch = line.match(/\/\*\s*(todo|fixme)(?:\([^)]*\))?(:.*?)?\s*\*\//i);
          if (multilineMatch) {
            const todoType = multilineMatch[1].toUpperCase();
            const todoDescription = (multilineMatch[2] || '').substring(1).trim() || 'Unspecified task';
            
            todos.push({
              file,
              line: i + 1,
              type: todoType,
              description: todoDescription,
              content: line.trim()
            });
          }
        }
        
        // Handle multiline comments that span multiple lines
        const multilineComments = content.match(/\/\*[\s\S]*?\*\//g);
        if (multilineComments) {
          for (const comment of multilineComments) {
            // Check if this multiline comment contains TODO/FIXME
            const todoMatch = comment.match(/(?:todo|fixme)(?:\([^)]*\))?(:.*?)?/i);
            if (todoMatch) {
              const todoType = todoMatch[1] ? 'TODO' : 'FIXME'; // Default to TODO if no specific type
              const todoDescription = (todoMatch[2] || '').substring(1).trim() || 'Unspecified task';
              
              // Find which line this comment is on
              const commentLines = comment.split('\n');
              const commentStartLine = content.substring(0, content.indexOf(comment)).split('\n').length;
              
              todos.push({
                file,
                line: commentStartLine,
                type: todoType,
                description: todoDescription,
                content: comment.replace(/\n/g, ' ').substring(0, 100) + '...' // Truncate long comments
              });
            }
          }
        }
      } catch (error) {
        // Skip files that can't be read
        console.warn(`Could not read file: ${file}`);
      }
    }
    
    return todos;
  } catch (error) {
    console.error('Error getting TODOs:', error);
    return [];
  }
}

// Function to get existing auto-created issues
async function getAutoCreatedIssues() {
  try {
    const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
      owner,
      repo,
      state: 'open',
      per_page: 100
    });
    
    // Filter for issues created by this automation (with AUTO-TODO prefix)
    return issues.filter(issue => 
      issue.title.startsWith('[AUTO-TODO]') || 
      issue.title.startsWith('[AUTO-FIXME]')
    );
  } catch (error) {
    console.error('Error fetching issues:', error);
    return [];
  }
}

// Function to create a new issue for a TODO
async function createTodoIssue(todo) {
  const title = `[AUTO-${todo.type}] ${todo.description}`;
  const body = `Auto-created issue from TODO comment in \`${todo.file}\` at line ${todo.line}:

\`\`\`
${todo.content}
\`\`\`

This issue was automatically generated. To resolve it, either:
1. Implement the requested feature/fix
2. Remove the TODO comment from the code

The issue will be automatically closed when the TODO is removed.`;
  
  try {
    const issue = await octokit.rest.issues.create({
      owner,
      repo,
      title,
      body,
      labels: ['auto-generated', 'todo']
    });
    
    console.log(`Created issue #${issue.data.number} for ${todo.file}:${todo.line}`);
    return issue.data.number;
  } catch (error) {
    console.error(`Error creating issue for ${todo.file}:${todo.line}`, error);
    return null;
  }
}

// Function to close an issue
async function closeIssue(issueNumber) {
  try {
    await octokit.rest.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state: 'closed',
      state_reason: 'completed'
    });
    
    console.log(`Closed issue #${issueNumber}`);
  } catch (error) {
    console.error(`Error closing issue #${issueNumber}`, error);
  }
}

// Main sync function
async function syncTodos() {
  try {
    // Get current TODOs
    const currentTodos = getTodos();
    console.log(`Found ${currentTodos.length} TODOs in the codebase`);
    
    // Get existing auto-created issues
    const existingIssues = await getAutoCreatedIssues();
    console.log(`Found ${existingIssues.length} auto-created issues`);
    
    // Create a map of TODOs for easy lookup
    const todoMap = new Map();
    for (const todo of currentTodos) {
      const key = `${todo.file}:${todo.line}:${todo.type}:${todo.description}`;
      todoMap.set(key, todo);
    }
    
    // Create a map of issues for easy lookup
    const issueMap = new Map();
    for (const issue of existingIssues) {
      // Extract file, line, type, and description from issue title and body
      const titleMatch = issue.title.match(/\[AUTO-(TODO|FIXME)\]\s*(.*)/);
      if (titleMatch) {
        const type = titleMatch[1];
        const description = titleMatch[2];
        
        // Extract file and line from issue body
        const bodyMatch = issue.body?.match(/`([^`]+)` at line (\d+)/);
        if (bodyMatch) {
          const file = bodyMatch[1];
          const line = bodyMatch[2];
          const key = `${file}:${line}:${type}:${description}`;
          issueMap.set(key, issue);
        }
      }
    }
    
    // Create issues for new TODOs
    for (const [key, todo] of todoMap.entries()) {
      if (!issueMap.has(key)) {
        console.log(`Creating new issue for TODO in ${todo.file}:${todo.line}`);
        await createTodoIssue(todo);
      }
    }
    
    // Close issues for removed TODOs
    for (const [key, issue] of issueMap.entries()) {
      if (!todoMap.has(key)) {
        console.log(`Closing issue #${issue.number} as TODO was removed`);
        await closeIssue(issue.number);
      }
    }
    
    console.log('TODO sync completed successfully');
  } catch (error) {
    console.error('Error during TODO sync:', error);
    process.exit(1);
  }
}

// Run the sync
syncTodos();