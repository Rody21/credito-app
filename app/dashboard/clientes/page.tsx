import { getCustomers } from "@/lib/customers";
import CustomersView from "@/components/customers/customers-view";

export default async function ClientesPage() {
    const customers = await getCustomers();

    return <CustomersView initialCustomers={customers ?? []} />;
}