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

### Source Documentation (`/docs`)
Describes all Corezoid entities (processes, nodes, logic)

- **Process Documentation** (`/docs/process/`) - Definition, operational mechanics, and key features of Corezoid processes
  - Process JSON structure and validation requirements
  - Best practices for process design and implementation
  - Error handling patterns and escalation workflows
  - Process parameters and data flow management

- **Node Documentation** (`/docs/nodes/`) - Detailed information about all node types in Corezoid
  - Flow Control: Start, End, Condition, Delay nodes
  - Data Manipulation: Set Parameters, Code nodes
  - Integration: API Call, Git Call, Database Call nodes
  - Process Interaction: Call Process, Reply to Process nodes
  - Task Management: Queue, Get from Queue, Copy Task, Modify Task nodes

- **Task Documentation** (`/docs/tasks/`) - Definition, structure, and examples of tasks in Corezoid
  - Task data structure and reference handling
  - Task lifecycle and state management
  - Examples of different task types and use cases

  
### ConvCTL (`/convctl.sh`)
- **Process Manipulation Tool** 
  - CLI interface for process creation and modification
  - Validation and correction utilities
  - Corezoid API integration components
  - Error handling and diagnostics
    
- It is part of the Prompt-Based Process Creation solution, powered by Devin AI
    [Prompt-Based Process Creation.md](./Prompt-Based%20Process%20Creation.md)



### JSON Schema (`/json-schema`)
- **Complete Process Structure Description**
  - Detailed JSON Schema for validation
  - Process structure validation rules and constraints
  - Node type-specific validation requirements
  - Reference validation and relationship constraints
  - Version-specific schema variants


### Playbooks (`/playbooks`)
All available playbooks
- **Process Creation Playbook** 
  - Step-by-step guide for creating Corezoid processes
  - Implementation workflow and best practices
  - References to detailed documentation in the repository


### Samples (`/samples`)
- **Real-life Process Examples** 
  - Complete working processes demonstrating various Corezoid features
  - API integration examples with different authentication methods
  - Business logic implementation patterns
  - Error handling and recovery flows
  - Data transformation and enrichment examples

### Temporary Resources (`/.processes`)
- **Project Resource Storage** 
  - Temporary directory for project resources
  - Extracted project components for analysis
  - Generated process files before deployment
  - Final target process storage
  - Working directory for process transformation

## 📄 License

MIT License - See LICENSE file for details.

