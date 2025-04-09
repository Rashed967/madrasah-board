'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MarkazValidation } from '@/features/markaz/markaz.validation'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { getAllMadrasahs } from '@/services/madrasahService'
import { IMadrasah } from '@/features/madrasah/interfaces'
import { createMarkaz } from '@/features/markaz/markazService'
import toast, { Toaster } from 'react-hot-toast'


const AddMarkaz = () => {
    const [searchMadrasahQuery, setSearchMadrasahQuery] = useState('')
    const [searchAllMadrasahQuery, setSearchAllMadrasahQuery] = useState('')
    const [searchResults, setSearchResults] = useState<IMadrasah[]>([])
    const [allMadrasahResults, setAllMadrasahResults] = useState<IMadrasah[]>([])
    const [selectedMadrasah, setSelectedMadrasah] = useState<IMadrasah | null>(null)
    const [selectedAllMadrasah, setSelectedAllMadrasah] = useState<IMadrasah[]>([])
    const [showMadrasahResults, setShowMadrasahResults] = useState(false)
    const [showAllMadrasahResults, setShowAllMadrasahResults] = useState(false)

    const form = useForm({
        resolver: zodResolver(MarkazValidation.createMarkazValidationSchema),
        defaultValues: {
            body: {
                madrasah: '',
                allMadrasah: [],
                code: ''
            }
        }
    })

    const handleSearch = async (searchTerm: string, type: 'single' | 'multiple') => {
        try {
            if (type === 'single') {
                setSearchMadrasahQuery(searchTerm);
                if (searchTerm.length >= 3) {
                    const queryParams = new URLSearchParams({ searchTerm: searchTerm });
                    queryParams.append('page', '1');
                    queryParams.append('limit', '10');
                    if(searchTerm) {
                        queryParams.append('searchTerm', searchTerm);
                    }
                    const response = await getAllMadrasahs(queryParams.toString());
                    console.log(response);
                    if(response.success) {
                        setSearchResults(response.data);
                        setShowMadrasahResults(true);
                    }
                } else {
                    setSearchResults([]);
                    setShowMadrasahResults(false);
                }
            } else {
                setSearchAllMadrasahQuery(searchTerm);
                if (searchTerm.length >= 3) {
                    const queryParams = new URLSearchParams({ searchTerm: searchTerm });
                    queryParams.append('page', '1');
                    queryParams.append('limit', '10');
                    if(searchTerm) {
                        queryParams.append('searchTerm', searchTerm);
                    }
                    const response = await getAllMadrasahs(queryParams.toString());
                    if(response.success) {
                        setAllMadrasahResults(response.data);
                        setShowAllMadrasahResults(true);
                    }
                } else {
                    setAllMadrasahResults([]);
                    setShowAllMadrasahResults(false);
                }
            }
        } catch (error) {
            console.error('মাদ্রাসা খোঁজার সময় সমস্যা হয়েছে:', error);
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent, type: 'single' | 'multiple') => {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (type === 'single') {
                handleSearch(searchMadrasahQuery, 'single')
            } else {
                handleSearch(searchAllMadrasahQuery, 'multiple')
            }
        }
    }

    const selectMadrasah = (madrasah: IMadrasah) => {
        setSelectedMadrasah(madrasah)
        form.setValue('body.madrasah', madrasah._id)
        setSearchMadrasahQuery(`${madrasah.madrasahNames.bengaliName} - ${madrasah.code}`)
        setShowMadrasahResults(false)
    }

    const selectAllMadrasah = (madrasah: IMadrasah) => {
        if (!selectedAllMadrasah.find(m => m._id === madrasah._id)) {
            const newSelected = [...selectedAllMadrasah, madrasah]
            setSelectedAllMadrasah(newSelected)
            form.setValue('body.allMadrasah', newSelected.map(m => m._id))
        }
        setShowAllMadrasahResults(false)
        setSearchAllMadrasahQuery('')
    }

    const removeSelectedMadrasah = (id: string) => {
        const filtered = selectedAllMadrasah.filter(m => m._id !== id)
        setSelectedAllMadrasah(filtered)
        form.setValue('body.allMadrasah', filtered.map(m => m._id))
    }

    const onSubmit = async (data: any) => {
        // console.log(data)
        // এখানে API কল করে ডাটা সেভ করতে হবে
        try {
            const response = await createMarkaz(data.body)
            console.log(response)
            if(response.success) {
                toast.success(response.message)
                // Reset form
                form.reset()
                setSelectedMadrasah(null)
                setSelectedAllMadrasah([])
                setSearchMadrasahQuery('')
                setSearchAllMadrasahQuery('')
            } else {
                console.log(response)
                toast.error(response.message)
            }
        } catch (error) {
            // console.log(error)
            toast.error('কিছু ভুল হয়েছে')
        }
    }

    return (
       <>
        <Toaster position="top-right" />
        <div className="container mx-auto p-6 mt-6" >
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h1 className="text-lg font-bold mb-6 text-center text-gray-800">নতুন মারকায যোগ করুন</h1>
                    
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* মাদ্রাসা সিলেক্ট */}
                            <FormField
                                control={form.control}
                                name="body.madrasah"
                                render={({ field }) => (
                                    <FormItem className="relative">
                                        <Input
                                            placeholder="মাদ্রাসা খুঁজুন"
                                            value={searchMadrasahQuery}
                                            className="bg-gray-50/50 text-gray-700"
                                            onChange={(e) => {
                                                setSelectedMadrasah(null)
                                                handleSearch(e.target.value, 'single')
                                            }}
                                        />
                                        {showMadrasahResults && searchResults.length > 0 && (
                                            <div className="absolute z-50 w-full bg-white border rounded-md mt-1">
                                                <ScrollArea className="h-48">
                                                    <div className="p-1">
                                                        {searchResults.map((madrasah) => (
                                                            <div
                                                                key={madrasah._id}
                                                                className="p-2 hover:bg-gray-100 cursor-pointer rounded-sm"
                                                                onClick={() => selectMadrasah(madrasah)}
                                                            >
                                                                <div className="text-gray-700">{madrasah.madrasahNames.bengaliName}</div>
                                                                <div className="text-xs text-gray-500">কোড: {madrasah.code}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </ScrollArea>
                                            </div>
                                        )}
                                        {/* {selectedMadrasah && (
                                            <div className="mt-2">
                                                <Badge>{selectedMadrasah.madrasahNames.bengaliName}</Badge>
                                            </div>
                                        )} */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* সকল মাদ্রাসা সিলেক্ট */}
                            <FormField
                                control={form.control}
                                name="body.allMadrasah"
                                render={({ field }) => (
                                    <FormItem className="relative">
                                        <Input
                                            placeholder="মাদ্রাসা অন্তুর্ভুক্ত করুন"
                                            value={searchAllMadrasahQuery}
                                            className="bg-gray-50/50 text-gray-700"
                                            onChange={(e) => handleSearch(e.target.value, 'multiple')}
                                        />
                                        {showAllMadrasahResults && allMadrasahResults.length > 0 && (
                                            <div className="absolute z-50 w-full bg-white border rounded-md mt-1">
                                                <ScrollArea className="h-48">
                                                    <div className="p-1">
                                                        {allMadrasahResults.map((madrasah) => (
                                                            <div
                                                                key={madrasah._id}
                                                                className="p-2 hover:bg-gray-100 cursor-pointer rounded-sm"
                                                                onClick={() => selectAllMadrasah(madrasah)}
                                                            >
                                                                <div className="text-gray-700">{madrasah.madrasahNames.bengaliName}</div>
                                                                <div className="text-xs text-gray-500">কোড: {madrasah.code}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </ScrollArea>
                                            </div>
                                        )}
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {selectedAllMadrasah.slice(0, 3).map((madrasah) => (
                                                <Badge
                                                    key={madrasah._id}
                                                    variant="secondary"
                                                    className="cursor-pointer"
                                                    onClick={() => removeSelectedMadrasah(madrasah._id)}
                                                >
                                                    {madrasah.madrasahNames.bengaliName} ✕
                                                </Badge>
                                            ))}
                                            {selectedAllMadrasah.length > 3 && (
                                                <Badge variant="outline">
                                                    আরও {selectedAllMadrasah.length - 3}টি
                                                </Badge>
                                            )}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* মারকায কোড */}
                            <FormField
                                control={form.control}
                                name="body.code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input 
                                                placeholder="মারকায কোড" 
                                                className="bg-gray-50/50 text-gray-700"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-center">
                                <Button type="submit" className="w-2/4 px-8 py-2 text-white bg-[#52b788] hover:bg-[#52b788]/70">
                                    সংরক্ষণ করুন
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
       </>
    )
}

export default AddMarkaz