// Loading State - Global loading indicator
import LoadingSpinner from '@/components/ui/LoadingSpinner';
export default function Loading() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <LoadingSpinner size="xl" label="جاري التحميل..." />
        </div>
    );
}

