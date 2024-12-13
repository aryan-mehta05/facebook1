"use client"

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'; // Adjust the import path based on your project structure
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'; // Adjust the import path based on your project structure
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, Share2, UserX2 } from 'lucide-react';

const PostOptionsMenu = ({ canDelete, canDeleteUser, onDelete, handleShare }) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeletePostDialogOpen, setIsDeletePostDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);

  return (
    <>
      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="dark:hover:bg-gray-500">
            <MoreHorizontal className="dark:text-white h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 z-50">
          {/* Share Option */}
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault(); // Prevent default behavior if necessary
              e.stopPropagation(); // Prevent DropdownMenu from closing
              setIsShareDialogOpen(true);
            }}
            className="cursor-pointer flex items-center space-x-2"
          >
            <Button
              variant="ghost"
              className="w-full"
            >
              <Share2 className="mr-2 h-4 w-4" />
              <span>Share</span>
            </Button>
          </DropdownMenuItem>

          {/* Conditional Delete Option */}
          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDeletePostDialogOpen(true);
                }}
                className="cursor-pointer flex items-center space-x-2"
              >
                <Button
                  variant="warning"
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete Post</span>
                </Button>
              </DropdownMenuItem>
              {canDeleteUser && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDeleteUserDialogOpen(true);
                  }}
                  className="cursor-pointer flex items-center space-x-2"
                >
                  <Button
                    variant="destructive"
                    className="w-full"
                  >
                    <UserX2 className="mr-2 h-4 w-4" />
                    <span>Delete User</span>
                  </Button>
                </DropdownMenuItem>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Share Dialog */}
      <Dialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share This Post</DialogTitle>
            <DialogDescription>
              Choose how you want to share this post
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 mt-4">
            <Button onClick={() => handleShare("facebook")}>
              Share on Facebook
            </Button>
            <Button onClick={() => handleShare("twitter")}>
              Share on Twitter
            </Button>
            <Button onClick={() => handleShare("linkedin")}>
              Share on Linkedin
            </Button>
            <Button onClick={() => handleShare("copy")}>Copy Link</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Post Confirmation Dialog */}
      {canDelete && (
        <Dialog
          open={isDeletePostDialogOpen}
          onOpenChange={setIsDeletePostDialogOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
              <DialogDescription className="text-red-500">
                Note: This action is not reversible!
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-4 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeletePostDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete();
                  setIsDeletePostDialogOpen(false);
                }}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete User Confirmation Dialog */}
      {canDeleteUser && (
        <Dialog
          open={isDeleteUserDialogOpen}
          onOpenChange={setIsDeleteUserDialogOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
              <DialogDescription className="text-red-500">
                Admin Note: This action is not reversible!
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-4 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteUserDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  alert("Deleted User Successfully!")
                  setIsDeleteUserDialogOpen(false);
                }}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PostOptionsMenu;
