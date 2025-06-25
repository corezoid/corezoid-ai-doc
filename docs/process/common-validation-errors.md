# Common Validation Errors in Corezoid Process JSON Files

This document outlines common validation errors encountered when creating or modifying Corezoid
process JSON files and provides solutions to prevent them.

## "Invalid scheme" Error

The "Invalid scheme" error is a common validation error that occurs when uploading a process to
Corezoid. This error indicates that the JSON structure of your process does not conform to the
expected schema. Below are the most common causes and solutions:

### 1. Process Structure Issues

#### Root Level Structure

Corezoid processes must be defined as objects:

```json
// CORRECT
{
  "obj_type": 1,
  "obj_id": 2000001,
  "parent_id": 0,
  "title": "Process Title",
  "status": "active",
  "params": [],
  "scheme": {
    // Process scheme with nodes
  }
}
```


#### Error Node References

All nodes that can fail (such as Code nodes, API Call nodes, Set Parameter nodes) must include an
`err_node_id` reference:

```json
// INCORRECT
{
  "type": "api_code",
  "lang": "js",
  "src": "// JavaScript code"
}

// CORRECT
{
  "type": "api_code",
  "lang": "js",
  "src": "// JavaScript code",
  "err_node_id": "abcdef0123456789abcdef15"
}
```

### 4. Parameter Configuration Issues

#### Extra and ExtraType Mismatch

All parameters defined in `extra` must have corresponding entries in `extra_type` and vice versa:

```json
// INCORRECT
"extra": {
  "param1": "value1",
  "param2": "value2"
},
"extra_type": {
  "param1": "string"
}

// CORRECT
"extra": {
  "param1": "value1",
  "param2": "value2"
},
"extra_type": {
  "param1": "string",
  "param2": "string"
}
```

#### Data Type Mismatch

The data types specified in `extra_type` must match the actual data types in `extra`:

```json
// INCORRECT
"extra": {
  "param1": "[1, 2, 3]"
},
"extra_type": {
  "param1": "string"
}

// CORRECT
"extra": {
  "param1": "[1, 2, 3]"
},
"extra_type": {
  "param1": "array"
}
```
