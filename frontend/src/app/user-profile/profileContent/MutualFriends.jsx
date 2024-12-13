import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserX, UserX2 } from "lucide-react";
import { userFriendStore } from "@/store/userFriendsStore";
import toast from "react-hot-toast";
import userStore from "@/store/userStore";

const MutualFriends = ({ id, isOwner }) => {
  const { fetchMutualFriends, mutualFriends, UnfollowUser } = userFriendStore();
  const { user } = userStore();

  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMutualFriends(id);
    }
  }, [id, fetchMutualFriends]);

  const handleUnfollow = async (userId) => {
    await UnfollowUser(userId);
    toast.success("you have unfollow successfully");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-4"
    >
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-300">
            Your Friends
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mutualFriends?.map((friend) => (
              <div
                key={friend?._id}
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-start justify-between"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    {friend?.profilePicture ? (
                      <AvatarImage
                        src={friend?.profilePicture}
                        alt={friend?.username}
                      />
                    ) : (
                      <AvatarFallback className="dark:bg-gray-400">
                        {userPlaceholder}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-semibold dark:text-gray-100">
                      {friend?.username}
                    </p>
                    <p className="text-sm text-gray-400">
                      {friend?.followerCount} folllowers
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4 text-gray-300" />
                    </Button>
                  </DropdownMenuTrigger>
                  {isOwner && (
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={async () => {
                          await handleUnfollow(friend?._id);
                          await fetchMutualFriends(id);
                        }}
                      >
                        <Button
                          variant="ghost"
                          className="w-full"
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          <span>Unfollow</span>
                        </Button>
                      </DropdownMenuItem>
                      {user?.role === "Admin" && (
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
                    </DropdownMenuContent>
                  )}
                </DropdownMenu>

                {user?.role === "Admin" && (
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MutualFriends;
