# Playbook: Fixing an Existing Corezoid Connector

## 1. 📋 General Concept

This playbook is designed for analyzing and fixing existing Corezoid connectors based on failed request results. This allows Devin AI to:

- Diagnose the causes of connector errors
- Make targeted fixes to process nodes
- Validate the fixed connector
- Save and upload the updated version to Corezoid

---

## 2. 📂 Connector Fixing Workflow

### 2.1. Getting Task Information

To fix a connector, you need to:
1. Specify the ResultNodeObjID where the request stopped
2. Provide ResultTaskData with the results of the request execution where the error occurred
3. Specify connection parameters:
- COREZOID_LOGIN
- COREZOID_SECRET
- COREZOID_WORKSPACE_ID
- COREZOID_PROC_ID

### 2.2. Getting the Current JSON Process

To work, we need to export the current version of the process for modification:

```bash
# Process export
cd ~/repos/corezoid-doc/scripts/validation/ && \
COREZOID_LOGIN=<COREZOID_LOGIN> COREZOID_SECRET=<COREZOID_SECRET> COREZOID_WORKSPACE_ID=<COREZOID_WORKSPACE_ID> COREZOID_PROC_ID=<COREZOID_PROC_ID> convctl.sh get ~/repos/corezoid-doc/result/target_process.json
```
where ~/repos/corezoid-doc/result/target_process.json - is where the exported JSON process will be saved

---

## 4. 🔧 Step-by-Step Guide for Fixing a Connector

### 4.1. Exporting the Current Process

```bash
cd ~/repos/corezoid-doc/scripts/validation/ && \
COREZOID_LOGIN=<COREZOID_LOGIN> COREZOID_SECRET=<COREZOID_SECRET> COREZOID_WORKSPACE_ID=<COREZOID_WORKSPACE_ID> COREZOID_PROC_ID=<COREZOID_PROC_ID> convctl.sh get ~/repos/corezoid-doc/result/target_process.json
```

### 4.2. Error Analysis and Identifying Node(s) for Fixing


### 4.3. Making Corrections to the Process JSON

### 4.4. Testing the Process by Executing a Test Request

```bash
cd ~/repos/corezoid-doc/scripts/validation/ && \
COREZOID_LOGIN=<COREZOID_LOGIN> COREZOID_SECRET=<COREZOID_SECRET> COREZOID_WORKSPACE_ID=<COREZOID_WORKSPACE_ID> COREZOID_PROC_ID=<COREZOID_PROC_ID> convctl.sh run ~/repos/corezoid-doc/result/target_process.json '<input_task_data>'
```
Where:

- `<input_task_data>` — json containing all incoming request parameters.


---


## 6. 📚 Documentation Links

- **Corezoid Node Types**:
  - [start-node.md](./src/nodes/start-node.md)
  - [code-node.md](./src/nodes/code-node.md)
  - [code-node-libraries.md](./src/nodes/code-node-libraries.md)
  - [api-call-node.md](./src/nodes/api-call-node.md)
  - [reply-to-process-node.md](./src/nodes/reply-to-process-node.md)
  - [end-node.md](./src/nodes/end-node.md)

- **Process Construction Rules**:
  - [process-development-guide.md](./src/process/process-development-guide.md)
  - [process-json-validation.md](./src/process/process-json-validation.md)
  - [error-handling.md](./src/process/error-handling.md)

- **Best Practices**:
  - [node-positioning-best-practices.md](./src/process/node-positioning-best-practices.md?ref_type=heads)
  - [common-validation-errors.md](./src/process/common-validation-errors.md)