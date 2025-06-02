
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import OrdersList from '@/components/admin/OrdersList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, Download, FileText, Trash2 } from "lucide-react";
import { fileStorage } from '@/services/fileStorage';
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showClearFilesDialog, setShowClearFilesDialog] = useState(false);
  const [showClearOrdersDialog, setShowClearOrdersDialog] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    
    if (!adminLoggedIn) {
      navigate('/login');
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/login');
  };

  const downloadAllFiles = () => {
    const files = fileStorage.getAllFiles();
    
    if (files.length === 0) {
      toast.info("No files available to download");
      return;
    }
    
    toast.success(`Preparing ${files.length} files for download`);
    // In a real app, this would trigger a zip download or batch download process
  };

  const clearAllFiles = () => {
    fileStorage.clearAllFiles();
    toast.success("All uploaded files have been cleared");
    setShowClearFilesDialog(false);
  };

  const clearAllOrders = () => {
    localStorage.setItem('xeroxOrders', JSON.stringify([]));
    toast.success("All orders have been cleared");
    setShowClearOrdersDialog(false);
    // Force reload the component to update UI
    window.location.reload();
  };
  
  if (!isLoggedIn) {
    return null; // Don't render anything while checking auth state
  }

  return (
    <PageLayout>
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Manage orders and settings
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
          
          <Tabs defaultValue="orders" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">All Orders</h2>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setShowClearOrdersDialog(true)}
                >
                  <Trash2 className="h-4 w-4" /> Clear All Orders
                </Button>
              </div>
              <OrdersList />
            </TabsContent>
            <TabsContent value="settings" className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold mb-6">Settings</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium text-gray-700">File Storage</h3>
                  <p className="mt-1 text-gray-600">Customer files are stored in the /uploads folder in the project. 
                  In a production environment, you would implement server storage or cloud storage solutions for better persistence.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium text-gray-700">Admin Credentials</h3>
                  <p className="mt-1 text-gray-600">Username: admin | Password: xerox123</p>
                  <p className="text-sm text-gray-500 mt-1">This is for demonstration purposes only. In a real app, you would use secure credential storage.</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="files" className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">All Uploaded Files</h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={downloadAllFiles}
                  >
                    <Download className="h-4 w-4" /> Download All
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setShowClearFilesDialog(true)}
                  >
                    <Trash2 className="h-4 w-4" /> Clear All Files
                  </Button>
                </div>
              </div>
              <FilesManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Alert Dialog for clearing files */}
      <AlertDialog open={showClearFilesDialog} onOpenChange={setShowClearFilesDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Files</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear all uploaded files? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={clearAllFiles} className="bg-red-600 hover:bg-red-700">
              Yes, Clear All Files
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog for clearing orders */}
      <AlertDialog open={showClearOrdersDialog} onOpenChange={setShowClearOrdersDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Orders</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear all orders? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={clearAllOrders} className="bg-red-600 hover:bg-red-700">
              Yes, Clear All Orders
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

// Simple files manager component
const FilesManager = () => {
  const [files, setFiles] = useState<Array<{name: string, size: number, type: string, path: string}>>([]);
  
  useEffect(() => {
    // Get all stored files
    const storedFiles = fileStorage.getAllFiles();
    setFiles(storedFiles);
  }, []);
  
  const handleFileDownload = (file: {path: string, name: string}) => {
    try {
      const storedFile = fileStorage.getFile(file.path);
      if (storedFile?.data) {
        // Create a URL for the blob
        const url = URL.createObjectURL(storedFile.data);
        // Create a temporary anchor element
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        // Trigger download
        a.click();
        // Clean up
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(`Downloading ${file.name}`);
      } else {
        toast.error("File data not available");
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error(`Failed to download ${file.name}`);
    }
  };
  
  return (
    <div>
      {files.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No files uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-xerox-600 mr-3" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB • {file.path}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => handleFileDownload(file)}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
