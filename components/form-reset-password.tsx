import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface LoginFormProps {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    email: string;
    setEmail: (email: string) => void;
}

export const FormResetPassword: React.FC<LoginFormProps> = ({ handleSubmit, email, setEmail }) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="tuUO@uniovi.es"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <Button type="submit" className="w-full">
                Recupera la contraseña 👏
            </Button>
        </form>
    );
}