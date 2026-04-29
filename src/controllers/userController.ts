import { Request, Response } from 'express';
import { supabase } from '../db';

export async function createUser(req: Request, res: Response): Promise<void> {
    const { username, email, date_of_birth } = req.body;

    if (!username || !email || !date_of_birth) {
        res.status(400).json({ error: 'username, email, and date_of_birth are required' });
        return;
    }

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_RE.test(email)) {
        res.status(400).json({ error: 'Invalid email address' });
        return;
    }

    const { data, error } = await supabase
        .from('users')
        .insert([{ username, email, date_of_birth }])
        .select()
        .single();

    if (error) {
        console.error('Supabase insert error:', error.code, error.message);
        if (error.code === '23505') {
            res.status(409).json({ error: 'A user with that email already exists' });
            return;
        }
        res.status(500).json({ error: error.message });
        return;
    }

    res.status(201).json(data);
}
