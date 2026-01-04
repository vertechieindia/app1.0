/**
 * VerTechie Enterprise IDE Service
 * 
 * Centralized service for all IDE operations including:
 * - Project management (CRUD, file operations)
 * - Code execution (Docker-based, multi-language)
 * - Git operations
 * - Workspace management
 */

import { getApiUrl, API_ENDPOINTS } from '../config/api';

// ============================================
// Types
// ============================================

export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  owner_email: string;
  project_type: string;
  framework: string;
  visibility: 'private' | 'team' | 'public';
  total_files: number;
  total_size_bytes: number;
  created_at: string;
  updated_at: string;
  last_opened_at: string | null;
}

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  language: string;
  content: string;
  size_bytes: number;
  version: number;
  locked_by: string | null;
}

export interface FileTreeNode {
  type: 'file' | 'folder';
  id: string;
  name: string;
  path: string;
  language?: string;
  size?: number;
  children?: FileTreeNode[];
}

export interface ProjectStructure {
  name: string;
  id: string;
  children: FileTreeNode[];
}

export interface ExecutionResult {
  status: 'success' | 'error' | 'timeout' | 'compile_error' | 'runtime_error' | 'wrong_answer' | 'time_limit' | 'memory_limit';
  output: string;
  error: string;
  compile_output?: string;
  runtime_ms: number;
  memory_kb: number;
  test_cases_passed: number;
  test_cases_total: number;
  test_results: TestResult[];
}

export interface TestResult {
  test_case: number;
  status: 'passed' | 'failed' | 'error' | 'wrong_answer' | 'time_limit' | 'runtime_error';
  input: string;
  expected: string;
  actual: string;
  error?: string;
  runtime_ms: number;
  memory_kb: number;
}

export interface SupportedLanguage {
  id: string;
  name: string;
  extension: string;
}

export interface GitStatus {
  success: boolean;
  files?: {
    staged: string[];
    modified: string[];
    untracked: string[];
    deleted: string[];
  };
  error?: string;
}

export interface GitCommit {
  hash: string;
  author: string;
  email: string;
  timestamp: number;
  message: string;
}

export interface Workspace {
  id: string;
  project: string;
  project_name: string;
  container_id: string;
  container_status: 'creating' | 'running' | 'paused' | 'stopped' | 'error';
  port: number | null;
  preview_url: string;
}

// ============================================
// API Helper
// ============================================

class IDEService {
  private baseUrl: string;
  
  constructor() {
    // Use the v_ide API endpoint
    this.baseUrl = getApiUrl('api/v_ide/');
  }
  
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }
  
  private async request<T>(
    endpoint: string,
    method: string = 'GET',
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: this.getAuthHeaders(),
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.detail || `Request failed: ${response.status}`);
    }
    
    return response.json();
  }
  
  // ============================================
  // Project Management
  // ============================================
  
  async listProjects(): Promise<Project[]> {
    return this.request<Project[]>('projects/');
  }
  
  async getProject(projectId: string): Promise<Project & { file_structure: ProjectStructure }> {
    return this.request(`projects/${projectId}/`);
  }
  
  async createProject(data: {
    name: string;
    description?: string;
    template?: string;
    project_type?: string;
  }): Promise<Project> {
    return this.request('projects/', 'POST', data);
  }
  
  async updateProject(projectId: string, data: Partial<Project>): Promise<Project> {
    return this.request(`projects/${projectId}/`, 'PATCH', data);
  }
  
  async deleteProject(projectId: string): Promise<void> {
    return this.request(`projects/${projectId}/`, 'DELETE');
  }
  
  async getProjectStructure(projectId: string): Promise<ProjectStructure> {
    return this.request(`projects/${projectId}/structure/`);
  }
  
  async exportProject(projectId: string): Promise<Blob> {
    const url = `${this.baseUrl}projects/${projectId}/export/`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to export project');
    }
    
    return response.blob();
  }
  
  async importProject(file: File, name: string): Promise<Project> {
    const url = `${this.baseUrl}projects/import_project/`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    
    const token = localStorage.getItem('authToken');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to import project');
    }
    
    return response.json();
  }
  
  // ============================================
  // File Operations
  // ============================================
  
  async getFile(fileId: string): Promise<ProjectFile> {
    return this.request(`files/${fileId}/`);
  }
  
  async createFile(projectId: string, path: string, content: string = ''): Promise<ProjectFile> {
    return this.request(`projects/${projectId}/files/`, 'POST', { path, content });
  }
  
  async updateFile(fileId: string, content: string): Promise<ProjectFile> {
    return this.request(`files/${fileId}/content/`, 'PUT', { content });
  }
  
  async deleteFile(fileId: string): Promise<void> {
    return this.request(`files/${fileId}/`, 'DELETE');
  }
  
  async createFolder(projectId: string, path: string): Promise<void> {
    return this.request(`projects/${projectId}/folders/`, 'POST', { path });
  }
  
  async lockFile(fileId: string): Promise<void> {
    return this.request(`files/${fileId}/lock/`, 'POST');
  }
  
  async unlockFile(fileId: string): Promise<void> {
    return this.request(`files/${fileId}/unlock/`, 'POST');
  }
  
  // ============================================
  // Code Execution
  // ============================================
  
  async execute(
    code: string,
    language: string,
    input: string = '',
    options?: {
      time_limit_ms?: number;
      memory_limit_mb?: number;
      test_cases?: Array<{ input: string; expected_output: string }>;
    }
  ): Promise<ExecutionResult> {
    return this.request('execute/', 'POST', {
      code,
      language,
      input,
      time_limit_ms: options?.time_limit_ms ?? 5000,
      memory_limit_mb: options?.memory_limit_mb ?? 256,
      test_cases: options?.test_cases ?? [],
    });
  }
  
  async run(code: string, language: string, input: string = ''): Promise<ExecutionResult> {
    return this.request('run/', 'POST', { code, language, input });
  }
  
  async getSupportedLanguages(): Promise<SupportedLanguage[]> {
    const response = await this.request<{ languages: SupportedLanguage[] }>('languages/');
    return response.languages;
  }
  
  // ============================================
  // Git Operations
  // ============================================
  
  async gitOperation(projectId: string, operation: string, params: any = {}): Promise<any> {
    return this.request(`git/${projectId}/`, 'POST', { operation, params });
  }
  
  async gitInit(projectId: string, branch: string = 'main'): Promise<any> {
    return this.gitOperation(projectId, 'init', { branch });
  }
  
  async gitStatus(projectId: string): Promise<GitStatus> {
    return this.gitOperation(projectId, 'status');
  }
  
  async gitAdd(projectId: string, files?: string[]): Promise<any> {
    return this.gitOperation(projectId, 'add', { files });
  }
  
  async gitCommit(projectId: string, message: string): Promise<any> {
    return this.gitOperation(projectId, 'commit', { message });
  }
  
  async gitPush(projectId: string, remote: string = 'origin', branch?: string): Promise<any> {
    return this.gitOperation(projectId, 'push', { remote, branch });
  }
  
  async gitPull(projectId: string, remote: string = 'origin', branch?: string): Promise<any> {
    return this.gitOperation(projectId, 'pull', { remote, branch });
  }
  
  async gitBranches(projectId: string): Promise<any> {
    return this.gitOperation(projectId, 'branches');
  }
  
  async gitCheckout(projectId: string, branch: string, create: boolean = false): Promise<any> {
    return this.gitOperation(projectId, 'checkout', { branch, create });
  }
  
  async gitLog(projectId: string, limit: number = 20): Promise<{ commits: GitCommit[] }> {
    return this.gitOperation(projectId, 'log', { limit });
  }
  
  async gitDiff(projectId: string, file?: string): Promise<any> {
    return this.gitOperation(projectId, 'diff', { file });
  }
  
  // ============================================
  // Workspace Management
  // ============================================
  
  async listWorkspaces(): Promise<Workspace[]> {
    return this.request('workspaces/');
  }
  
  async createWorkspace(projectId: string, templateId?: string): Promise<Workspace> {
    return this.request('workspaces/', 'POST', { project_id: projectId, template_id: templateId });
  }
  
  async startWorkspace(workspaceId: string): Promise<any> {
    return this.request(`workspaces/${workspaceId}/start/`, 'POST');
  }
  
  async stopWorkspace(workspaceId: string): Promise<any> {
    return this.request(`workspaces/${workspaceId}/stop/`, 'POST');
  }
  
  async restartWorkspace(workspaceId: string): Promise<any> {
    return this.request(`workspaces/${workspaceId}/restart/`, 'POST');
  }
  
  async getWorkspaceStatus(workspaceId: string): Promise<any> {
    return this.request(`workspaces/${workspaceId}/status/`);
  }
  
  async executeInWorkspace(workspaceId: string, command: string, workDir?: string): Promise<any> {
    return this.request(`workspaces/${workspaceId}/execute/`, 'POST', { command, work_dir: workDir });
  }
  
  // ============================================
  // Templates
  // ============================================
  
  async getTemplates(): Promise<any[]> {
    return this.request('templates/');
  }
  
  async getTemplatesByCategory(): Promise<Record<string, any[]>> {
    return this.request('templates/by_category/');
  }
}

// Export singleton instance
export const ideService = new IDEService();

// Export class for testing
export { IDEService };

