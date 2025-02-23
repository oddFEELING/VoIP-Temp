"use client";

import React from "react";
import Image from "next/image";
import { Download, Link, X, ZoomIn, ZoomOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Skeleton } from "../ui/skeleton";

interface ImageDisplayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
}

const ImageDisplayDialog: React.FC<ImageDisplayDialogProps> = ({
  open,
  onOpenChange,
  imageUrl,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [scale, setScale] = React.useState(1);

  // ~ ======= Handle image download ======= ~
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = imageUrl.split("/").pop() || "image";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Image downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  // ~ ======= Handle copy link ======= ~
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      toast({
        title: "Success",
        description: "Image link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  // ~ ======= Handle zoom controls ======= ~
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.5, 0.5));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/90 backdrop-blur-sm" />
        <DialogContent className="max-h-[95vh] max-w-[95vw] border-0 bg-transparent p-0">
          <div className="relative flex h-full w-full flex-col">
            {/* ~ ======= Close button ======= ~ */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 z-50 bg-black/50 text-white hover:bg-black/70"
                    onClick={() => onOpenChange(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Close</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* ~ ======= Image container ======= ~ */}
            <div className="relative flex h-[calc(90vh-4rem)] w-full items-center justify-center bg-transparent">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton className="h-full w-full" />
                </div>
              )}
              <div className="relative h-full w-full transition-all duration-300">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  className={cn(
                    "object-contain transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100",
                  )}
                  style={{ transform: `scale(${scale})` }}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                  quality={100}
                  onLoadingComplete={() => setIsLoading(false)}
                  priority
                />
              </div>
            </div>

            {/* ~ ======= Control buttons ======= ~ */}
            <div className="absolute bottom-0 left-0 right-0 flex w-full items-center justify-center gap-2 bg-black/50 p-4 backdrop-blur-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleZoomOut}
                      className="text-white hover:bg-white/20"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Zoom Out</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleZoomIn}
                      className="text-white hover:bg-white/20"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Zoom In</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDownload}
                      className="text-white hover:bg-white/20"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download Image</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopyLink}
                      className="text-white hover:bg-white/20"
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy Link</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default ImageDisplayDialog;
