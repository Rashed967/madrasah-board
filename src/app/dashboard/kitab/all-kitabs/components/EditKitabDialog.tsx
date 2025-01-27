'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IKitab } from "@/features/kitab/kitab.interface";
import { updateKitab } from "@/features/kitab/kitab.services";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface EditKitabDialogProps {
    kitab: IKitab;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function EditKitabDialog({ kitab, isOpen, onClose, onSuccess }: EditKitabDialogProps) {
    const [formData, setFormData] = useState({
        bengaliName: '',
        arabicName: '',
        fullMarks: 0
    });

    useEffect(() => {
        if (kitab) {
            setFormData({
                bengaliName: kitab.name.bengaliName,
                arabicName: kitab.name.arabicName || '',
                fullMarks: kitab.fullMarks
            });
        }
    }, [kitab]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await updateKitab(kitab._id!.toString(), {
                name: {
                    bengaliName: formData.bengaliName,
                    arabicName: formData.arabicName
                },
                fullMarks: formData.fullMarks
            });

            if (response.success) {
                toast.success('কিতাব আপডেট করা হয়েছে');
                onSuccess();
                onClose();
            } else {
                toast.error(response.message || 'কিতাব আপডেট করা যায়নি');
            }
        } catch (error) {
            toast.error('কিতাব আপডেট করা যায়নি');
        }
    };

    return (
        <Dialog 
            isOpen={isOpen} 
            onClose={onClose}
            title=""
        >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>কিতাব এডিট করুন</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label htmlFor="bengaliName">কিতাবের নাম (বাংলা)</Label>
                        <Input
                            id="bengaliName"
                            value={formData.bengaliName}
                            onChange={(e) => setFormData(prev => ({ ...prev, bengaliName: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="arabicName">কিতাবের নাম (আরবি)</Label>
                        <Input
                            id="arabicName"
                            value={formData.arabicName}
                            onChange={(e) => setFormData(prev => ({ ...prev, arabicName: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fullMarks">পূর্ণ নম্বর</Label>
                        <Input
                            id="fullMarks"
                            type="number"
                            value={formData.fullMarks}
                            onChange={(e) => setFormData(prev => ({ ...prev, fullMarks: Number(e.target.value) }))}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        {/* <Button type="button" variant="outline" onClick={onClose}>
                            বাতিল করুন
                        </Button> */}
                        <Button type="submit" className="bg-[#52B788] hover:bg-[#429670] text-white">
                            আপডেট করুন
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
