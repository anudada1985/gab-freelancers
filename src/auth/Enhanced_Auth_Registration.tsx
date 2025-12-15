
/**
 * ENHANCED AUTH & REGISTRATION (ADMIN-CONFIGURABLE)
 * Drop-in compatible with your existing App.tsx
 * Author: ChatGPT
 */

// NOTE:
// - This file EXTENDS your current setup, it does NOT remove any existing logic
// - Admin can toggle required/optional fields from Admin Panel
// - Freelancer registration supports CNIC, uploads, address, phone, etc.
// - Backend/API integration can be added later (Firebase / Supabase / REST)

import React, { useState } from 'react';
import { UserRole, User } from './types';
import { Button } from './components/UIComponents';
import { Mail, Key, UserPlus, Phone, MapPin, FileBadge, Camera } from 'lucide-react';

/* ---------------- ADMIN CONFIG ---------------- */

export type RegistrationField = {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'file';
  required: boolean;
};

export const DEFAULT_FREELANCER_FIELDS: RegistrationField[] = [
  { key: 'name', label: 'Full Name', type: 'text', required: true },
  { key: 'email', label: 'Email Address', type: 'email', required: true },
  { key: 'password', label: 'Password', type: 'password', required: true },
  { key: 'phone', label: 'Contact Number', type: 'text', required: true },
  { key: 'address', label: 'Residential Address', type: 'text', required: false },
  { key: 'cnic', label: 'CNIC Number', type: 'text', required: true },
  { key: 'cnicFront', label: 'CNIC Front Image', type: 'file', required: true },
  { key: 'cnicBack', label: 'CNIC Back Image', type: 'file', required: true }
];

/* ---------------- REGISTER COMPONENT ---------------- */

export const FreelancerRegister = ({
  fields = DEFAULT_FREELANCER_FIELDS,
  onComplete
}: {
  fields?: RegistrationField[];
  onComplete: (user: User) => void;
}) => {
  const [data, setData] = useState<Record<string, any>>({});

  const handleSubmit = () => {
    for (const f of fields) {
      if (f.required && !data[f.key]) {
        alert(`${f.label} is required`);
        return;
      }
    }

    const user: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: UserRole.FREELANCER,
      verified: false,
      status: 'Pending Verification',
      balance: 0
    };

    onComplete(user);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl border">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <UserPlus /> Freelancer Registration
      </h2>

      <div className="space-y-4">
        {fields.map(field => (
          <div key={field.key}>
            <label className="block text-sm font-medium mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>

            {field.type === 'file' ? (
              <input
                type="file"
                onChange={e => setData({ ...data, [field.key]: e.target.files?.[0] })}
                className="w-full p-2 border rounded"
              />
            ) : (
              <input
                type={field.type}
                onChange={e => setData({ ...data, [field.key]: e.target.value })}
                className="w-full p-2 border rounded"
              />
            )}
          </div>
        ))}

        <Button onClick={handleSubmit} className="w-full">
          Submit Registration
        </Button>
      </div>
    </div>
  );
};

/* ---------------- ADMIN FIELD MANAGER (OPTIONAL) ---------------- */

export const AdminRegistrationFieldEditor = ({
  fields,
  onChange
}: {
  fields: RegistrationField[];
  onChange: (f: RegistrationField[]) => void;
}) => {
  const toggleRequired = (key: string) => {
    onChange(
      fields.map(f =>
        f.key === key ? { ...f, required: !f.required } : f
      )
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl border">
      <h3 className="font-bold mb-4">Registration Field Controls</h3>
      {fields.map(f => (
        <div key={f.key} className="flex justify-between items-center mb-2">
          <span>{f.label}</span>
          <button
            onClick={() => toggleRequired(f.key)}
            className={`px-3 py-1 rounded text-xs ${
              f.required ? 'bg-green-100 text-green-700' : 'bg-slate-100'
            }`}
          >
            {f.required ? 'Required' : 'Optional'}
          </button>
        </div>
      ))}
    </div>
  );
};

