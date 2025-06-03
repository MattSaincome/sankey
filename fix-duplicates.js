// Fix all duplicate variable declarations
const fs = require('fs');
const path = './public/d3-sankey.js';

let content = fs.readFileSync(path, 'utf8');

// Find all variable declarations and look for duplicates
const constPattern = /const\s+(\w+)\s*=/g;
const letPattern = /let\s+(\w+)\s*=/g;
const varPattern = /var\s+(\w+)\s*=/g;

const allDeclarations = [];
let match;

// Find all const declarations
while ((match = constPattern.exec(content)) !== null) {
    allDeclarations.push({
        type: 'const',
        name: match[1],
        position: match.index,
        fullMatch: match[0]
    });
}

// Reset regex
constPattern.lastIndex = 0;

// Find all let declarations  
while ((match = letPattern.exec(content)) !== null) {
    allDeclarations.push({
        type: 'let',
        name: match[1], 
        position: match.index,
        fullMatch: match[0]
    });
}

// Reset regex
letPattern.lastIndex = 0;

// Find all var declarations
while ((match = varPattern.exec(content)) !== null) {
    allDeclarations.push({
        type: 'var',
        name: match[1],
        position: match.index, 
        fullMatch: match[0]
    });
}

// Sort by position
allDeclarations.sort((a, b) => a.position - b.position);

// Find duplicates
const seen = new Map();
const duplicates = [];

allDeclarations.forEach(decl => {
    if (seen.has(decl.name)) {
        duplicates.push({
            name: decl.name,
            first: seen.get(decl.name),
            duplicate: decl
        });
    } else {
        seen.set(decl.name, decl);
    }
});

console.log('Found duplicate variable declarations:');
duplicates.forEach(dup => {
    console.log(`- "${dup.name}" declared as ${dup.first.type} and again as ${dup.duplicate.type}`);
    
    // Convert second declaration to assignment
    const lines = content.split('\n');
    const targetLineIndex = dup.duplicate.position;
    
    // Find which line this position is on
    let currentPos = 0;
    for (let i = 0; i < lines.length; i++) {
        if (currentPos + lines[i].length >= targetLineIndex) {
            console.log(`  Line ${i + 1}: ${lines[i].trim()}`);
            break;
        }
        currentPos += lines[i].length + 1; // +1 for newline
    }
});

// Fix duplicates by changing subsequent declarations to assignments
duplicates.forEach(dup => {
    const pattern = new RegExp(`\\b${dup.duplicate.type}\\s+(${dup.name})\\s*=`, 'g');
    content = content.replace(pattern, `${dup.name} =`);
});

fs.writeFileSync(path, content);
console.log(`Fixed ${duplicates.length} duplicate variable declarations`);
