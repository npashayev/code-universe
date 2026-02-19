import FormError from "./FormError";

interface FormFieldProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

const FormField = ({ id, label, type = 'text', value, onChange, error }: FormFieldProps) => (
    <div className="mb-4">
        <label htmlFor={id} className="block mb-2 font-medium text-gray-300">
            {label}
        </label>
        <input
            id={id}
            type={type}
            className="border rounded p-2 w-full bg-gray-700 text-gray-100 border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={onChange}
        />
        {error && <FormError error={error} />}
    </div>
);

export default FormField;