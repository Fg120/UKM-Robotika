import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

interface FormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onSaved: () => void;
}

declare global {
    function route(name: string, params?: any): string;
}

export default function UserModal({ isOpen, onClose, user, onSaved }: UserModalProps) {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '',
                password_confirmation: ''
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                password_confirmation: ''
            });
        }
        setErrors({});
    }, [user, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: []
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const url = user 
                ? route('admin.users.update', user.id)
                : route('admin.users.store');
            
            const method = user ? 'PUT' : 'POST';

            const csrfToken = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken?.content || '',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                console.log(data.message); // Use console.log instead of toast for now
                onSaved();
                onClose();
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    console.error(data.message || 'An error occurred'); // Use console.error instead of toast
                }
            }
        } catch (error) {
            console.error('Error:', error);
            console.error('An error occurred while saving user'); // Use console.error instead of toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {user ? 'Edit User' : 'Create New User'}
                    </DialogTitle>
                    <DialogDescription>
                        {user 
                            ? 'Make changes to the user here. Click save when you\'re done.'
                            : 'Fill in the details to create a new user. Click save when you\'re done.'
                        }
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={errors.name ? 'border-red-500' : ''}
                                placeholder="Enter user name"
                                required
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">{errors.name[0]}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={errors.email ? 'border-red-500' : ''}
                                placeholder="Enter email address"
                                required
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600">{errors.email[0]}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Password {!user && '*'}
                                {user && <span className="text-gray-500 text-xs ml-1">(leave blank to keep current)</span>}
                            </Label>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={errors.password ? 'border-red-500' : ''}
                                placeholder="Enter password"
                                required={!user}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-600">{errors.password[0]}</p>
                            )}
                        </div>

                        {/* Password Confirmation Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">
                                Confirm Password {!user && '*'}
                            </Label>
                            <Input
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleInputChange}
                                className={errors.password_confirmation ? 'border-red-500' : ''}
                                placeholder="Confirm password"
                                required={!user || !!formData.password}
                            />
                            {errors.password_confirmation && (
                                <p className="text-sm text-red-600">{errors.password_confirmation[0]}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (user ? 'Update User' : 'Create User')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}