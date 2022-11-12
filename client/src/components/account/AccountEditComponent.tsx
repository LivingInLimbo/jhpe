import { LabledTextInput } from "../forms/LabledTextInput";
import { useState } from "react";

type User = {
  id: number;
  phone?: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

export const AccountEditComponent = ({ user }: { user: User }) => {
  const [form, setForm] = useState({
    phone: user.phone,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  });

  const setFormField = (e: any, key: string) => {
    setForm({ ...form, [key]: e.target.value });
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block select-none font-medium text-sm mb-1">
          Email
        </label>
        <div className="font-light">{user.email}</div>
      </div>
      <LabledTextInput
        label="First Name"
        value={form.firstName}
        onChange={(e: any) => setFormField(e, "firstName")}
      />
      <LabledTextInput
        label="Last Name"
        value={form.lastName}
        onChange={(e: any) => setFormField(e, "lastName")}
      />
      <LabledTextInput
        label="Phone"
        value={form.phone}
        onChange={(e: any) => setFormField(e, "phone")}
      />
    </div>
  );
};
