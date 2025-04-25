#!/usr/bin/env node

/**
 * Node Positioning Helper Script
 * 
 * This script analyzes Corezoid process schemas and automatically adjusts node positions
 * according to the positioning guidelines to create cleaner diagrams with minimal edge intersections.
 * 
 * Usage: npm run reposition-nodes -- path/to/process.json
 */

const fs = require('fs');
const path = require('path');

const NODE_TYPE_START = 1;
const NODE_TYPE_END = 2;
const NODE_TYPE_CONDITION = 0;
const NODE_TYPE_NORMAL = 3;

const DIMENSIONS = {
  START_END: {
    width: 56,
    height: 56,
    radius: 28,
    pivotPoint: 'center'
  },
  STANDARD: {
    width: 200,
    minHeight: 100,
    pivotPoint: 'top-left'
  },
  CONDITION: {
    width: 200,
    minHeight: 110,
    pivotPoint: 'top-left'
  }
};

const SPACING = {
  VERTICAL: 200,
  HORIZONTAL: 300,
  ERROR_HORIZONTAL: 250
};

function processFile(filePath) {
  console.log(`Processing file: ${filePath}`);
  
  try {
    const processData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!processData.scheme || !processData.scheme.nodes || !Array.isArray(processData.scheme.nodes)) {
      console.error('Invalid process schema format: Missing nodes array');
      return;
    }
    
    const nodes = processData.scheme.nodes;
    
    const startNode = nodes.find(node => node.obj_type === NODE_TYPE_START);
    
    if (!startNode) {
      console.error('No start node found in the process');
      return;
    }
    
    const nodesById = {};
    nodes.forEach(node => {
      nodesById[node.id] = node;
    });
    
    const connections = {};
    nodes.forEach(node => {
      if (node.condition && node.condition.logics) {
        node.condition.logics.forEach(logic => {
          if (logic.to_node_id) {
            if (!connections[node.id]) {
              connections[node.id] = [];
            }
            connections[node.id].push(logic.to_node_id);
          }
        });
      }
    });
    
    const nodeLevels = {};
    const nodeColumns = {};
    
    nodeLevels[startNode.id] = 0;
    nodeColumns[startNode.id] = 0;
    
    function traverseFlow(nodeId, level, column, visited = {}) {
      if (visited[nodeId]) return;
      visited[nodeId] = true;
      
      nodeLevels[nodeId] = level;
      nodeColumns[nodeId] = column;
      
      if (connections[nodeId]) {
        const mainFlow = [];
        const branches = [];
        
        connections[nodeId].forEach(targetId => {
          const targetNode = nodesById[targetId];
          if (!targetNode) return;
          
          if (nodesById[nodeId].obj_type === NODE_TYPE_CONDITION && branches.length === 0) {
            branches.push(targetId);
          } else if (targetNode.obj_type === NODE_TYPE_END && targetNode.extra && 
                    targetNode.extra.includes('error')) {
            branches.push(targetId);
          } else {
            mainFlow.push(targetId);
          }
        });
        
        mainFlow.forEach(targetId => {
          traverseFlow(targetId, level + 1, column, visited);
        });
        
        branches.forEach((targetId, index) => {
          traverseFlow(targetId, level, column + index + 1, visited);
        });
      }
    }
    
    traverseFlow(startNode.id, 0, 0);
    
    const baseX = 500; // Base X coordinate for the main flow
    const baseY = 100; // Base Y coordinate for the top level
    
    nodes.forEach(node => {
      const level = nodeLevels[node.id] || 0;
      const column = nodeColumns[node.id] || 0;
      
      node.y = baseY + (level * SPACING.VERTICAL);
      
      let xPos = baseX + (column * SPACING.HORIZONTAL);
      
      if (node.obj_type === NODE_TYPE_START || node.obj_type === NODE_TYPE_END) {
        xPos += 100; // Add 100px offset for center-pivot nodes
      }
      
      node.x = xPos;
    });
    
    const outputPath = filePath.replace('.json', '.repositioned.json');
    fs.writeFileSync(outputPath, JSON.stringify(processData, null, 2));
    
    console.log(`Process repositioned successfully. Output saved to: ${outputPath}`);
    
  } catch (error) {
    console.error(`Error processing file: ${error.message}`);
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Please provide a path to a process JSON file');
    console.log('Usage: npm run reposition-nodes -- path/to/process.json');
    process.exit(1);
  }
  
  const filePath = args[0];
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
  
  processFile(filePath);
}

main();
