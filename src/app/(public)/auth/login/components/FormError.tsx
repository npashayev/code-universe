import { cn } from "@/lib/utils/cn";

interface Props {
    error: string;
    className?: string;
}

const FormError = ({ error, className }: Props) => {
    return (
        <p className={cn('text-red-600 mt-2 text-sm font-medium', className)}>{error}</p>
    )
}

export default FormError