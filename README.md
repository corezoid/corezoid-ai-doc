# Corezoid AI Documentation

This repository contains comprehensive documentation for Corezoid AI, a process engine platform for
creating business processes, services, and applications powered by artificial intelligence. The documentation is enhanced with AI capabilities to provide better guidance and examples.

## 🔍 Overview

Corezoid AI is a powerful process engine that enables:
- Visual design of business processes through connected nodes
- Data processing with various node types (API calls, code execution, conditions)
- Integration with external systems through standardized interfaces
- Error handling and retry mechanisms
- Creation of modular, reusable process components
- Packaging and deployment of processes in a standardized format

## 📚 Repository Structure

The repository is organized into the following key directories:

### Source Documentation (`/src`)

- **Process Documentation** (`/src/process/`) - Definition, operational mechanics, and key features of Corezoid processes
  - Process JSON structure and validation requirements
  - Best practices for process design and implementation
  - Error handling patterns and escalation workflows
  - Process parameters and data flow management

- **Node Documentation** (`/src/nodes/`) - Detailed information about all node types in Corezoid
  - Flow Control: Start, End, Condition, Delay nodes
  - Data Manipulation: Set Parameters, Code nodes
  - Integration: API Call, Git Call, Database Call nodes
  - Process Interaction: Call Process, Reply to Process nodes
  - Task Management: Queue, Get from Queue, Copy Task, Modify Task nodes

- **Task Documentation** (`/src/tasks/`) - Definition, structure, and examples of tasks in Corezoid
  - Task data structure and reference handling
  - Task lifecycle and state management
  - Examples of different task types and use cases

- **Folder Documentation** (`/src/folders/`) - Information about folder structure and ZIP format for Corezoid processes
  - Folder JSON structure and organization
  - ZIP packaging format for deployment
  - Versioning and deployment guidelines

### Scripts (`/scripts`)

- **Validation Scripts** - Tools for validating process JSON against schema
  - `process-schema.json` - Definitive schema for process structure validation
  - Validation utilities for ensuring process definitions meet required standards

- **Node Positioning** - Utilities for properly positioning nodes in process diagrams
  - `reposition-nodes.js` - Script for optimizing node layout in process diagrams

- **Documentation Build** - Scripts for generating documentation outputs
  - `build-docs.js` - Generates AI documentation from markdown sources

### Playbooks (`/playbook`)

- **Process Creation Playbook** - Step-by-step guide for creating Corezoid processes
  - Implementation workflow and best practices
  - References to detailed documentation in the repository

## 🛠️ Development

### Prerequisites

- Node.js (for documentation formatting tools)
- Git

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/corezoid/corezoid-ai-doc.git
   cd corezoid-ai-doc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Available Scripts

This project includes several npm scripts to help with documentation management:

- **Format markdown files**:
  These scripts ensure consistent formatting across all markdown files using Prettier.

  ```bash
  npm run format        # Format all markdown files in the repository
  npm run format:check  # Check if markdown files are properly formatted without making changes
  npm run format:all    # Format all markdown files (alias for format)
  ```

- **Validate JSON schema**:
  These scripts validate JSON files against the process schema to ensure they meet the required standards.

  ```bash
  npm run validate                                    # Validate JSON schema (alias for validate:schema)
  npm run validate:schema                             # Validate JSON examples against schema using default paths
  SCHEMA_PATH=path/to/schema.json npm run validate    # Validate using custom schema path
  EXAMPLES_PATH=path/to/examples npm run validate     # Validate using custom examples path
  ```

- **Node positioning and documentation**:
  These scripts help with node layout in process diagrams and building documentation.
  
  ```bash
  npm run reposition-nodes # Reposition nodes in process diagrams for optimal layout
  npm run build:docs       # Build documentation for AI assistance from markdown sources
  ```

### VS Code Integration

This repository includes VS Code settings for automatic formatting on save. To use these features:

1. Install the recommended VS Code extensions:

   - Prettier - Code formatter

2. The included `.vscode/settings.json` will automatically format files when you save them.

## 🤝 Contributing

When contributing to this documentation:

1. Create a new branch from `develop`
2. Make your changes following the established structure
3. Format your documentation using `npm run format`
4. Create a merge request targeting the `develop` branch

### Merge Request Guidelines

When creating merge requests:

- Enable "Delete source branch when merge request is accepted"
- Enable "Squash commits when merge request is accepted"
- Target the `develop` branch
- Provide a clear description of your changes

### File Naming Conventions

- Use kebab-case for all filenames (e.g., `api-call-node.md`, `reply-to-process.conv.json`)
- Follow the naming patterns established in the `/src/nodes` folder
- For process examples, use descriptive names that indicate the node type or pattern being
  demonstrated

## 📄 License

MIT License - See LICENSE file for details.

