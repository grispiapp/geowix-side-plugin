interface CustomerInfoProps {
    title: string;
    customer: {
        name?: string;
        email?: string;
        phone?: string;
        address?: string;
    };
}

export const CustomerInfo = ({ title, customer }: CustomerInfoProps) => (
    <div className="space-y-1 bg-white p-3 shadow">
        <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
        <div>
            <div>{customer.name}</div>
            <div className="flex flex-col *:text-sm">
                <span>{customer.email}</span>
                <span>{customer.phone}</span>
                <span>{customer.address}</span>
            </div>
        </div>
    </div>
);
