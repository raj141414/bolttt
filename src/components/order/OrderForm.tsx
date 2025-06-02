import React, { useState, useEffect } from 'react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FileUploader from './FileUploader';
import { CheckCircle, Copy, Phone, Mail, Calculator, FileText } from "lucide-react";
import { toast } from "sonner";

const orderSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number." }),
  printType: z.string(),
  copies: z.coerce.number().min(1),
  paperSize: z.string(),
  printSide: z.string(),
  selectedPages: z.string(),
  colorPages: z.string().optional(),
  bwPages: z.string().optional(),
  specialInstructions: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderSchema>;

const OrderForm = () => {
  const { toast: showToast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPages, setSelectedPages] = useState('all');
  const [calculatedCost, setCalculatedCost] = useState(0);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);
  const [isCustomPrint, setIsCustomPrint] = useState(false);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      printType: "blackAndWhite",
      copies: 1,
      paperSize: "a4",
      printSide: "single",
      selectedPages: "all",
      colorPages: "",
      bwPages: "",
      specialInstructions: "",
    },
  });

  const calculateSelectedPagesCount = (selectedPagesStr: string, totalPages: number): number => {
    if (selectedPagesStr === 'all') {
      return totalPages;
    }

    const pageRanges = selectedPagesStr.split(',').map(range => range.trim());
    let selectedPagesCount = 0;

    for (const range of pageRanges) {
      if (range.includes('-')) {
        const [start, end] = range.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          selectedPagesCount += (end - start + 1);
        }
      } else {
        const page = Number(range);
        if (!isNaN(page)) {
          selectedPagesCount += 1;
        }
      }
    }

    return selectedPagesCount;
  };

  const calculateCost = (values: OrderFormValues) => {
    const isDoubleSided = values.printSide === 'double';
    const copies = values.copies || 1;
    
    let totalCost = 0;
    
    if (values.printType === 'custom') {
      // Calculate cost for color pages
      if (values.colorPages) {
        const colorPageRanges = values.colorPages.split(',').map(range => range.trim());
        let colorPagesCount = 0;
        
        for (const range of colorPageRanges) {
          if (range.includes('-')) {
            const [start, end] = range.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end) && start <= end) {
              colorPagesCount += (end - start + 1);
            }
          } else {
            const page = Number(range);
            if (!isNaN(page)) {
              colorPagesCount += 1;
            }
          }
        }
        
        const colorCostPerPage = isDoubleSided ? 13 : 8;
        totalCost += colorPagesCount * colorCostPerPage;
      }
      
      // Calculate cost for B&W pages
      if (values.bwPages) {
        const bwPageRanges = values.bwPages.split(',').map(range => range.trim());
        let bwPagesCount = 0;
        
        for (const range of bwPageRanges) {
          if (range.includes('-')) {
            const [start, end] = range.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end) && start <= end) {
              bwPagesCount += (end - start + 1);
            }
          } else {
            const page = Number(range);
            if (!isNaN(page)) {
              bwPagesCount += 1;
            }
          }
        }
        
        const bwCostPerPage = isDoubleSided ? 1.6 : 1.5;
        totalCost += bwPagesCount * bwCostPerPage;
      }
    } else {
      const isColor = values.printType === 'color';
      let pagesCount = calculateSelectedPagesCount(values.selectedPages, totalPages);
      
      let costPerPage;
      if (isColor) {
        costPerPage = isDoubleSided ? 13 : 8;
      } else {
        costPerPage = isDoubleSided ? 1.6 : 1.5;
      }
      
      let effectivePages = pagesCount;
      if (isDoubleSided) {
        effectivePages = Math.ceil(pagesCount / 2);
      }
      
      totalCost = effectivePages * costPerPage;
    }
    
    totalCost *= copies;
    setCalculatedCost(totalCost);
    return totalCost;
  };

  const handleFilesChange = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
    
    // Create preview URLs for the files
    const urls = uploadedFiles.map(file => URL.createObjectURL(file));
    setFilePreviewUrls(urls);
  };

  const handlePageCountChange = (pageCount: number) => {
    setTotalPages(pageCount);
    form.setValue('selectedPages', `1-${pageCount}`);
    calculateCost(form.getValues());
  };

  const handlePageRangeChange = (pageRange: string) => {
    form.setValue('selectedPages', pageRange);
    calculateCost(form.getValues());
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      filePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [filePreviewUrls]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(submittedOrderId);
    toast.success("Order ID copied to clipboard!");
  };

  const validatePageSelection = (input: string, totalPages: number): boolean => {
    if (input === 'all') return true;
    
    const pageRanges = input.split(',').map(range => range.trim());
    for (const range of pageRanges) {
      if (range.includes('-')) {
        const [start, end] = range.split('-').map(Number);
        if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
          return false;
        }
      } else {
        const page = Number(range);
        if (isNaN(page) || page < 1 || page > totalPages) {
          return false;
        }
      }
    }
    return true;
  };

  const onSubmit = async (data: OrderFormValues) => {
    if (files.length === 0) {
      showToast({
        title: "No files selected",
        description: "Please upload at least one file to print.",
        variant: "destructive",
      });
      return;
    }

    if (data.printType === 'custom') {
      if (!data.colorPages && !data.bwPages) {
        showToast({
          title: "Page selection required",
          description: "Please specify either color or black & white pages.",
          variant: "destructive",
        });
        return;
      }
    } else if (!validatePageSelection(data.selectedPages, totalPages)) {
      showToast({
        title: "Invalid page selection",
        description: "Please check your page selection.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      ...data,
      files: files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        path: `/uploads/${file.name}`,
      })),
      orderId: `ORD-${Date.now()}`,
      orderDate: new Date().toISOString(),
      status: "pending",
      totalCost: calculatedCost,
    };

    const existingOrders = JSON.parse(localStorage.getItem('xeroxOrders') || '[]');
    localStorage.setItem('xeroxOrders', JSON.stringify([...existingOrders, orderData]));

    setSubmittedOrderId(orderData.orderId);
    setOrderSubmitted(true);

    showToast({
      title: "Order submitted successfully!",
      description: `Your order ID is ${orderData.orderId}`,
    });
  };

  const startNewOrder = () => {
    setOrderSubmitted(false);
    setSubmittedOrderId('');
    setFiles([]);
    setTotalPages(0);
    setCalculatedCost(0);
    setFilePreviewUrls([]);
    setIsCustomPrint(false);
    form.reset();
  };

  // Watch form values for cost calculation
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (totalPages > 0) {
        calculateCost(value as OrderFormValues);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, totalPages]);

  // Watch print type for custom printing option
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'printType') {
        setIsCustomPrint(value.printType === 'custom');
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  if (orderSubmitted) {
    return (
      <div className="space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-800">Order Submitted Successfully!</CardTitle>
            <CardDescription className="text-green-700">
              Your print job has been received and will be processed soon.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-green-200">
              <h3 className="font-semibold text-lg text-gray-800 mb-3 text-center">Your Order ID</h3>
              <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <span className="text-2xl font-mono font-bold text-xerox-700 select-all">
                  {submittedOrderId}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyOrderId}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              </div>
              <p className="text-sm text-gray-600 text-center mt-3">
                Save this Order ID to track your order status
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-3">What's Next?</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• We'll process your order and prepare your prints</li>
                <li>• You can track your order status using the Order ID above</li>
                <li>• We'll contact you when your order is ready for pickup</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">Contact Information</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>6301526803</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>aishwaryaxerox1999@gmail.com</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={startNewOrder}
                className="flex-1 bg-xerox-600 hover:bg-xerox-700"
              >
                Place Another Order
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('/track', '_blank')}
                className="flex-1"
              >
                Track This Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="123-456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="printType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Print Type</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setIsCustomPrint(value === 'custom');
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select print type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="blackAndWhite">Black & White</SelectItem>
                        <SelectItem value="color">Color</SelectItem>
                        <SelectItem value="custom">Custom (Mix Color & B/W)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="printSide"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Print Side</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select side" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Single Side</SelectItem>
                        <SelectItem value="double">Double Side</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="copies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Copies</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value > 0) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paperSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paper Size</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="a4">A4</SelectItem>
                        <SelectItem value="a3">A3</SelectItem>
                        <SelectItem value="letter">Letter</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isCustomPrint && (
                <FormField
                  control={form.control}
                  name="selectedPages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Selection</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 1-5, 8, 11-13 or 'all'" 
                          {...field}
                          disabled={totalPages === 0}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            const newValues = form.getValues();
                            newValues.selectedPages = e.target.value;
                            calculateCost(newValues);
                          }}
                        />
                      </FormControl>
                      <p className="text-sm text-gray-500">
                        {totalPages > 0 ? `Total pages: ${totalPages}` : 'Upload a file to select pages'}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {isCustomPrint && (
                <>
                  <FormField
                    control={form.control}
                    name="colorPages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color Pages</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., 1-3, 5, 7-9" 
                            {...field}
                            disabled={totalPages === 0}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              calculateCost(form.getValues());
                            }}
                          />
                        </FormControl>
                        <p className="text-sm text-gray-500">
                          Specify pages to print in color
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bwPages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Black & White Pages</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., 4, 6, 10-12" 
                            {...field}
                            disabled={totalPages === 0}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              calculateCost(form.getValues());
                            }}
                          />
                        </FormControl>
                        <p className="text-sm text-gray-500">
                          Specify pages to print in black & white
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <FormField
              control={form.control}
              name="specialInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Instructions</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any special instructions here..." 
                      className="min-h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Upload Files</h3>
            <FileUploader 
              onFilesChange={handleFilesChange} 
              onPageCountChange={handlePageCountChange}
              onPageRangeChange={handlePageRangeChange}
            />

            {files.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Files Preview</h4>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="h-5 w-5 text-xerox-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {calculatedCost > 0 && (
            <Card className="bg-xerox-50 border-xerox-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-xerox-600" />
                    <h3 className="font-medium text-xerox-900">Estimated Cost</h3>
                  </div>
                  <p className="text-2xl font-bold text-xerox-700">
                    ₹{calculatedCost.toFixed(2)}
                  </p>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {!isCustomPrint && (
                    <>
                      <p>• Selected pages: {form.getValues('selectedPages')}</p>
                      <p>• {form.getValues('printType') === 'color' ? 'Color' : 'Black & White'} printing</p>
                    </>
                  )}
                  {isCustomPrint && (
                    <>
                      <p>• Color pages: {form.getValues('colorPages') || 'None'}</p>
                      <p>• B&W pages: {form.getValues('bwPages') || 'None'}</p>
                    </>
                  )}
                  <p>• {form.getValues('printSide') === 'double' ? 'Double' : 'Single'}-sided</p>
                  <p>• {form.getValues('copies')} {form.getValues('copies') === 1 ? 'copy' : 'copies'}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full md:w-auto bg-xerox-600 hover:bg-xerox-700"
              disabled={calculatedCost === 0}
            >
              Submit Order
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OrderForm;