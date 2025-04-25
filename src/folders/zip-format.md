# ZIP Format for Corezoid Processes and Folders

## Overview

The ZIP format is the default and recommended format for organizing and deploying Corezoid processes
and folders. This format provides a structured way to package multiple processes and their parent
folders in a single archive, making it easier to manage, share, and deploy complex process
ecosystems.

## ZIP Structure and Naming Conventions

### Folder Structure

The ZIP archive should follow this structure:

```
folder_{folder_id}_{timestamp}.zip/
└── {folder_id}_{folder_title}.folder/
    ├── {folder_id}_{folder_title}.folder.json
    ├── {process_id}_{process_title}_v{version}.conv.json
    ├── {process_id}_{process_title}_v{version}.conv.json
    └── ...
```

### File Naming Conventions

1. **ZIP Archive**: `folder_{folder_id}_{timestamp}.zip`

   - `folder_id`: The unique identifier of the root folder (numeric)
   - `timestamp`: Unix timestamp to ensure uniqueness (e.g., 1744361844773)
   - Example: `folder_612594_1744361844773.zip`

2. **Folder Directory**: `{folder_id}_{folder_title}.folder/`

   - `folder_id`: The unique identifier of the folder (numeric)
   - `folder_title`: The title of the folder with spaces replaced by underscores
   - The `.folder` extension is required to identify it as a folder
   - Example: `612594_Calculator_v2.0.folder/`

3. **Folder JSON File**: `{folder_id}_{folder_title}.folder.json`

   - Contains the folder metadata (obj_type, obj_id, parent_id, title, description)
   - The filename must match the folder directory name with `.json` appended
   - Example: `612594_Calculator_v2.0.folder.json`

4. **Process JSON Files**: `{process_id}_{process_title}_v{version}.conv.json`
   - `process_id`: The unique identifier of the process (numeric)
   - `process_title`: The title of the process with spaces replaced by underscores
   - `version`: The version number of the process (e.g., 2.0)
   - The `.conv.json` extension is required for process files
   - Example: `1646041_Calculator_Main_Process_v2.0.conv.json`
   - Contains the complete process definition including nodes, connections, and parameters

## File Content Requirements

### Folder JSON File

The folder JSON file should contain only the folder metadata:

```json
{
  "obj_type": 0,
  "obj_id": 612594,
  "parent_id": 0,
  "title": "Calculator v2.0",
  "description": "A refactored calculator with separate processes for each operation"
}
```

### Process JSON Files

Each process JSON file should contain the complete process definition:

```json
{
  "obj_type": 1,
  "obj_id": 1646041,
  "parent_id": 612594,
  "title": "Calculator Main Process v2.0",
  "description": "Entry point for calculator operations - routes to specific operation processes",
  "status": "active",
  "params": [...],
  "ref_mask": true,
  "conv_type": "process",
  "scheme": {
    "nodes": [...],
    "web_settings": [[],[]]
  }
}
```

## Key Requirements

1. **Unique IDs**: Each folder and process must have a unique `obj_id`
2. **Parent-Child Relationships**: Process `parent_id` should match the folder's `obj_id`
3. **Valid Node IDs**: All node IDs must be 24-byte hexadecimal strings
4. **Process Calls**: Use `api_rpc` (not `api_call_rpc`) for calling other processes
6. **Extra Type Parameters**: Always include `extra_type` parameters when using `extra` in node
   configurations

## Process Call Configuration

When calling another process from within a process using the ZIP format, ensure the process JSON
uses the correct `api_rpc` node configuration. For detailed information on configuring Call Process
nodes, including the required parameters like `type`, `conv_id`, `extra`, `extra_type`, and
`err_node_id`, please refer to the
[Process JSON Validation documentation](../process/process-json-validation.md#call-process-nodes).

## Best Practices

1. **Version Numbers in Titles**: Include version numbers in process titles (e.g., "Calculator
   v2.0")
2. **Descriptive Filenames**: Use descriptive names that clearly indicate the purpose of each
   process
3. **Consistent Naming**: Maintain consistent naming conventions across all files
4. **Proper Indentation**: Format JSON files with proper indentation for readability
5. **Complete Metadata**: Include all required metadata fields in each file
6. **Validate Before Packaging**: Validate all JSON files before packaging them into the ZIP archive
7. **Unique Timestamps**: Use unique timestamps in ZIP filenames to avoid conflicts

## Example

The following example shows a ZIP archive containing a calculator folder with multiple processes:

```
folder_612594_1744361844773.zip/
└── 612594_Calculator_v2.0.folder/
    ├── 612594_Calculator_v2.0.folder.json
    ├── 1646041_Calculator_Main_Process_v2.0.conv.json
    ├── 1646042_Addition_Process_v2.0.conv.json
    ├── 1646043_Subtraction_Process_v2.0.conv.json
    ├── 1646044_Multiplication_Process_v2.0.conv.json
    └── 1646045_Division_Process_v2.0.conv.json
```

## Related Documentation

- [Folders Overview](README.md) - General documentation for folders
- [Processes Overview](../process/README.md) - Documentation for processes
- [Nodes Overview](../nodes/README.md) - Documentation for nodes that make up processes
