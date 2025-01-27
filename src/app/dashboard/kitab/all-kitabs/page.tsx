'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { IKitab } from "@/features/kitab/kitab.interface";
import { getAllKitabs, deleteKitab } from '@/features/kitab/kitab.services';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { EditKitabDialog } from './components/EditKitabDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeleteConfirmation } from './components/DeleteConfirmation';

const dummyKitabs: IKitab[] = [];

export default function AllKitabsPage() {
    const [kitabs, setKitabs] = useState<IKitab[]>(dummyKitabs);
    const [isLoading, setIsLoading] = useState(true);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedKitab, setSelectedKitab] = useState<IKitab | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedKitabId, setSelectedKitabId] = useState<string | null>(null);

    useEffect(() => {
        loadKitabs();
    }, []);

    const loadKitabs = async () => {
        try {
            setIsLoading(true);
            const response = await getAllKitabs();
            if (response.success) {
                setKitabs(response.data);
            }
        } catch (error) {
            console.error('Error loading kitabs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await deleteKitab(id);
            if (response.success) {
                toast.success('কিতাব ডিলিট করা হয়েছে');
                loadKitabs(); // Reload the list after successful deletion
            } else {
                toast.error(response.message || 'কিতাব ডিলিট করা যায়নি');
            }
        } catch (error) {
            toast.error('কিতাব ডিলিট করা যায়নি');
        }
    };

    const handleEdit = (kitab: IKitab) => {
        setSelectedKitab(kitab);
        setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setSelectedKitab(null);
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <div className="container mx-auto mt-2 pt-4 px-2 md:p-6">
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-lg font-bold">সকল কিতাব</h1>
                        <div className="text-sm text-muted-foreground">
                            মোট কিতাব: {Number(kitabs.length).toLocaleString('bn-BD')}
                        </div>
                    </div>

                    <Card className="rounded-lg overflow-scroll">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-[#52B788] text-white">
                                    <TableRow>
                                        <TableHead>ক্রমিক</TableHead>
                                        <TableHead>বাংলা নাম</TableHead>
                                        <TableHead>আরবি নাম</TableHead>
                                        <TableHead>কোড</TableHead>
                                        <TableHead>পূর্ণ নম্বর</TableHead>
                                        <TableHead className="text-right">অ্যাকশন</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {kitabs.length === 0 ? (
                                        <TableRow className='pt-3'>
                                            <TableCell colSpan={6} className="text-center py-4 ">
                                                কোনো কিতাব নেই
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        kitabs.map((kitab, index) => (
                                            <TableRow key={kitab._id?.toString()} className={index % 2 === 1 ? 'bg-gray-300 text-gray-800' : 'text-gray-800'}>
                                                <TableCell>{Number(index + 1).toLocaleString('bn-BD')}</TableCell>
                                                <TableCell>{kitab.name.bengaliName}</TableCell>
                                                <TableCell>{kitab.name.arabicName || '-'}</TableCell>
                                                <TableCell>{Number(kitab.code).toLocaleString('bn-BD') || '-'}</TableCell>
                                                <TableCell>{Number(kitab.fullMarks).toLocaleString('bn-BD')}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-6 w-6 p-0 bg-[#52B788] rounded-full">
                                                                <MoreHorizontal className="h-4 w-4 text-white" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-white/70 text-gray-700">
                                                            <DropdownMenuItem onClick={() => handleEdit(kitab)}>
                                                                এডিট করুন
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                className="text-red-600"
                                                                onClick={() => {
                                                                    setSelectedKitabId(kitab._id.toString());
                                                                    setSelectedKitab(kitab);
                                                                    setShowDeleteDialog(true);
                                                                }}
                                                            >
                                                                ডিলিট করুন
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {selectedKitab && (
                <EditKitabDialog
                    kitab={selectedKitab}
                    isOpen={editDialogOpen}
                    onClose={handleCloseEditDialog}
                    onSuccess={loadKitabs}
                />
            )}

            <DeleteConfirmation
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={() => {
                    if (selectedKitabId) {
                        handleDelete(selectedKitabId);
                    }
                    setShowDeleteDialog(false);
                }}
                selectedKitab={selectedKitab}
            />
        </>
    );
}