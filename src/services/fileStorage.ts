
/**
 * File Storage Service
 * 
 * This service provides utilities for handling file uploads and downloads.
 * In a real production environment, this would interface with a server-side 
 * storage system or cloud storage solution.
 */

// Define interfaces for file handling
export interface StoredFile {
  name: string;
  size: number;
  type: string;
  path: string;
  data?: File | Blob;
}

// Create a class to handle file storage
class FileStorageService {
  private static instance: FileStorageService;
  private filesMap: Map<string, StoredFile> = new Map();
  
  private constructor() {
    // Initialize with any existing files from localStorage
    try {
      const savedFiles = localStorage.getItem('xeroxStoredFiles');
      if (savedFiles) {
        const filesData = JSON.parse(savedFiles);
        filesData.forEach((file: StoredFile) => {
          this.filesMap.set(file.path, file);
        });
      }
    } catch (error) {
      console.error('Error loading stored files:', error);
    }
  }
  
  public static getInstance(): FileStorageService {
    if (!FileStorageService.instance) {
      FileStorageService.instance = new FileStorageService();
    }
    return FileStorageService.instance;
  }
  
  // Save a file to "storage"
  public saveFile(file: File): Promise<StoredFile> {
    return new Promise((resolve, reject) => {
      try {
        const filePath = `/uploads/${file.name}`;
        const storedFile: StoredFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          path: filePath,
          data: file
        };
        
        this.filesMap.set(filePath, storedFile);
        this.persistToLocalStorage();
        
        resolve(storedFile);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Get a file by path
  public getFile(path: string): StoredFile | undefined {
    if (!path) {
      console.error('Attempted to get file with undefined path');
      return undefined;
    }
    
    const file = this.filesMap.get(path);
    
    if (!file) {
      console.log('File not found:', path);
      console.log('Available files:', Array.from(this.filesMap.keys()));
      
      // Try to find by name as fallback
      const fileName = path.split('/').pop();
      if (fileName) {
        for (const [, storedFile] of this.filesMap) {
          if (storedFile.name === fileName) {
            console.log(`Found file by name instead: ${fileName}`);
            return storedFile;
          }
        }
      }
    }
    
    return file;
  }
  
  // Get all stored files
  public getAllFiles(): StoredFile[] {
    return Array.from(this.filesMap.values());
  }
  
  // Clear all stored files
  public clearAllFiles(): void {
    this.filesMap.clear();
    this.persistToLocalStorage();
  }
  
  // Save current state to localStorage
  private persistToLocalStorage(): void {
    try {
      // We don't store the actual file data in localStorage, just the metadata
      const filesForStorage = Array.from(this.filesMap.values()).map(file => {
        const { data, ...fileWithoutData } = file;
        return fileWithoutData;
      });
      
      localStorage.setItem('xeroxStoredFiles', JSON.stringify(filesForStorage));
    } catch (error) {
      console.error('Error saving files to localStorage:', error);
    }
  }
  
  // Create a download URL for a file
  public createDownloadUrl(file: StoredFile): string | null {
    try {
      if (file.data) {
        return URL.createObjectURL(file.data);
      }
      return null;
    } catch (error) {
      console.error('Error creating download URL:', error);
      return null;
    }
  }
}

export const fileStorage = FileStorageService.getInstance();
