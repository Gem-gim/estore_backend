import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as React from "react";
import { Brand } from "@/types";

export function DeleteBrand({ item }: { item: Brand }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const deleteBrand = async () => {
    if (loading) {
      return;
    }

    const data = {
      id: item._id,
    };

    setLoading(true);
    await axios
      .delete(process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/brands", { data })
      .then((response) => {
        const data = response.data;
        toast(data.message);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        router.refresh();
        setLoading(false);
      });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2Icon className="text-red-600 " />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your item
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteBrand}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
